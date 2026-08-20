import { afterEach, describe, expect, it } from "vitest"
import {
  isFoundationModule,
  listBusinessDomains,
  listFoundationModules,
  listPlatformDomains,
  moduleLayerOf,
  rpcPolicy,
} from "../../constants/domain-catalog"
import { registerService } from "../broker-invoke"
import { natsSubscribe, resetNatsFabric } from "../nats-fabric"
import { createDomainFacade } from "../rpc-facade"
import {
  assertSupportedRemoteProtocol,
  decodeRpcPayload,
  describeInvoke,
  encodeRpcPayload,
  resolveInvokeMode,
} from "../rpc-protocol"
import { broker, resetBroker } from "../service-broker"

describe("module layers", () => {
  it("keeps shared as undeployable foundation SDK", () => {
    expect(listFoundationModules()).toEqual(["shared"])
    expect(isFoundationModule("shared")).toBe(true)
    expect(moduleLayerOf("shared")).toBe("foundation")
    expect(rpcPolicy().local.mode).toBe("sdk")
  })

  it("classifies system/infra as platform and pay as business", () => {
    expect(listPlatformDomains().map((domain) => domain.name)).toEqual(["system", "infra"])
    expect(moduleLayerOf("system")).toBe("platform")
    expect(moduleLayerOf("pay")).toBe("business")
    expect(listBusinessDomains().some((domain) => domain.name === "pay")).toBe(true)
  })
})

describe("rpc protocol and codec", () => {
  it("uses SDK in the same runtime and RPC when the domain is packed out", () => {
    expect(resolveInvokeMode("pay", {})).toBe("sdk")
    expect(resolveInvokeMode("pay", { RUOYI_DOMAIN_PAY_UPSTREAM: "http://pay:3100" })).toBe("rpc")
    expect(describeInvoke("mall", { RUOYI_PACK_DOMAIN: "pay" })).toEqual({
      mode: "rpc",
      protocol: "nats-rr",
      serialization: "json",
      facadeRequired: true,
    })
    expect(describeInvoke("pay", { RUOYI_PACK_DOMAIN: "pay" }).mode).toBe("sdk")
    expect(describeInvoke("mall", { RUOYI_PACK_DOMAIN: "pay", RUOYI_RPC_PROTOCOL: "grpc" })).toEqual({
      mode: "rpc",
      protocol: "grpc",
      serialization: "protobuf",
      facadeRequired: true,
    })
  })

  it("rejects Dubbo/Thrift and JSON-clones remote payloads", () => {
    expect(() => assertSupportedRemoteProtocol("dubbo")).toThrow(/Rejected RPC protocol/)
    expect(() => assertSupportedRemoteProtocol("thrift")).toThrow(/Rejected RPC protocol/)
    const input = { amount: 9900, nested: { id: "1" } }
    const encoded = encodeRpcPayload(input) as { nested: { id: string } }
    expect(encoded).toEqual(input)
    expect(encoded).not.toBe(input)
    encoded.nested.id = "mutated"
    expect(input.nested.id).toBe("1")
    const frame = encodeRpcPayload({ amount: 9900 }, "protobuf")
    expect(frame).toBeInstanceOf(Uint8Array)
    expect(decodeRpcPayload(frame, "protobuf")).toEqual({ amount: 9900 })
  })

  it("refuses to treat shared as an RPC service", () => {
    expect(() => resolveInvokeMode("shared")).toThrow(/SDK-only/)
  })
})

describe("dual-mode broker invoke and facade", () => {
  afterEach(() => {
    resetBroker()
    resetNatsFabric()
  })

  it("calls colocated domains through in-memory SDK", async () => {
    registerService("pay", async (method, payload) => ({ method, payload }))
    broker.start({})
    const result = await broker.call("pay.ping", { n: 1 })
    expect(result.success).toBe(true)
    expect(result.invokeMode).toBe("sdk")
    expect(result.data).toEqual({ method: "ping", payload: { n: 1 } })
  })

  it("serializes remote calls through NATS request-reply", async () => {
    natsSubscribe("ruoyi.cmd.mall.>", async (message) => ({ echo: message.data }), { queue: "ruoyi.mall" })
    broker.start({ RUOYI_PACK_DOMAIN: "pay" })
    broker.registerRemoteService("mall")
    const result = await broker.call("mall.ping", { n: 2 }, { caller: "pay.order" })
    expect(result.success).toBe(true)
    expect(result.invokeMode).toBe("rpc")
    expect(result.data).toEqual({ echo: { n: 2 } })
  })

  it("exposes RPC methods only through a domain facade", async () => {
    registerService("pay", async (method) => ({ ok: method }))
    broker.start({})
    const pay = createDomainFacade("pay", ["ping", "createOrder"] as const)
    const result = await pay.ping({ n: 1 })
    expect(pay.domain).toBe("pay")
    expect(result.success).toBe(true)
    expect(result.invokeMode).toBe("sdk")
    expect(result.data).toEqual({ ok: "ping" })
  })

  it("dispatches remote calls through in-house gRPC unary", async () => {
    const { decodeRpcPayload, encodeRpcPayload } = await import("../rpc-protocol")
    const { grpcBindService } = await import("../grpc-fabric")
    grpcBindService("mall", async (method, data) => {
      const payload = decodeRpcPayload(data, "protobuf") as { n: number }
      return encodeRpcPayload({ echo: payload, method }, "protobuf")
    })
    broker.start({ RUOYI_PACK_DOMAIN: "pay", RUOYI_RPC_PROTOCOL: "grpc" })
    broker.registerRemoteService("mall")
    const result = await broker.call("mall.ping", { n: 3 }, { caller: "pay.order" })
    expect(result.success).toBe(true)
    expect(result.invokeMode).toBe("rpc")
    expect(result.rpcProtocol).toBe("grpc")
    expect(result.data).toEqual({ echo: { n: 3 }, method: "ping" })
  })

  it("validates pay facade actions from the contract schema file", async () => {
    const { registerActionSchemas } = await import("@/modules/pay/contract/actions")
    const { payFacade } = await import("@/modules/pay/contract/pay.facade")
    registerActionSchemas()
    registerService("pay", async (method) => ({ ok: method }))
    broker.start({})
    const rejected = await payFacade.createOrder({ amount: 1 })
    expect(rejected.success).toBe(false)
    expect(rejected.error).toMatch(/ValidationError/)
    const ok = await payFacade.ping({ n: 1 })
    expect(ok.success).toBe(true)
    expect(ok.invokeMode).toBe("sdk")
    expect(ok.rpcProtocol).toBe("in-process")
  })

  it("routes pay facade methods onto the real PayService", async () => {
    const { payFacade } = await import("@/modules/pay/contract/pay.facade")
    broker.start({})
    const ping = await payFacade.ping({ n: 9 })
    expect(ping.success).toBe(true)
    expect(ping.data).toEqual({ pong: true, domain: "pay", n: 9 })
    const created = await payFacade.createOrder({
      appId: "app-facade",
      channelCode: "MOCK",
      merchantOrderId: `MO-FACADE-${Date.now()}`,
      subject: "facade create",
      amount: 100,
    })
    expect(created.success).toBe(true)
    expect(created.invokeMode).toBe("sdk")
    expect(created.data).toMatchObject({ status: "WAITING", amount: 100, appId: "app-facade" })
  })

  it("routes infra.updateConfig onto InfraConfigService by catalog service name", async () => {
    const { infraFacade } = await import("@/modules/infra/contract/infra.facade")
    broker.start({})
    const updated = await infraFacade.updateConfig({
      key: "sys.application.name",
      value: "ruoyi-all-next-facade",
    })
    expect(updated.success, updated.error).toBe(true)
    expect(updated.data).toMatchObject({ key: "sys.application.name", value: "ruoyi-all-next-facade" })
  })

  it("exposes infra codegen preview on the domain facade", async () => {
    const { infraFacade } = await import("@/modules/infra/contract/infra.facade")
    broker.start({})
    const preview = await infraFacade.previewCodegen({
      moduleName: "infra",
      className: "DemoWidget",
      businessName: "演示部件",
      template: "CRUD",
      scene: "ADMIN",
      generateFrontend: false,
      generateTest: false,
      table: {
        name: "demo_widget",
        comment: "demo",
        schema: "public",
        type: "TABLE",
        columns: [
          { name: "id", type: "varchar", tsType: "string", nullable: false, isPrimary: true, isAutoIncrement: false, uiComponent: "HIDDEN" },
          { name: "name", type: "varchar", tsType: "string", nullable: false, isPrimary: false, isAutoIncrement: false, uiComponent: "INPUT" },
        ],
        primaryKey: ["id"],
        indexes: [],
      },
    })
    expect(preview.success, preview.error).toBe(true)
    expect(preview.invokeMode).toBe("sdk")
    const files = (preview.data as { files?: Array<{ path: string; content: string }> } | undefined)?.files ?? []
    expect(files.some((item) => item.path.endsWith("demo-widget.rpc.ts") && item.content.includes("createDomainFacade"))).toBe(true)
  })

  it("uses HTTP RPC when BFF splits pay via upstream", async () => {
    const payEnv = { RUOYI_PACK_DOMAIN: "pay", RUOYI_RPC_TOKEN: "secret" }
    const originalFetch = globalThis.fetch
    globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
      expect(String(url)).toBe("http://pay.test:3214/api/internal/rpc")
      const body = JSON.parse(String(init?.body))
      const headers: Record<string, string> = {}
      new Headers(init?.headers).forEach((value, key) => {
        headers[key.toLowerCase()] = value
      })
      const { handleInternalRpc } = await import("../rpc-http")
      const result = await handleInternalRpc({ ...body, headers, env: payEnv })
      return new Response(JSON.stringify(result.success ? { success: true, data: result.data } : { success: false, error: result.error }), {
        status: result.success ? 200 : result.status,
        headers: { "content-type": "application/json" },
      })
    }) as typeof fetch
    try {
      const { payFacade } = await import("@/modules/pay/contract/pay.facade")
      broker.start({
        RUOYI_DOMAIN_PAY_UPSTREAM: "http://pay.test:3214",
        RUOYI_RPC_TOKEN: "secret",
      })
      const ping = await payFacade.ping({ n: 4 })
      expect(ping.success, ping.error).toBe(true)
      expect(ping.invokeMode).toBe("rpc")
      expect(ping.rpcProtocol).toBe("nats-rr")
      expect(ping.data).toEqual({ pong: true, domain: "pay", n: 4 })
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
