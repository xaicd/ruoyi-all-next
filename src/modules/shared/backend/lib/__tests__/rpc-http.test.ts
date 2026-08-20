import { afterEach, describe, expect, it } from "vitest"
import { handleInternalRpc, resolveRpcBaseUrl, rpcHttpPath } from "../rpc-http"
import { resetBroker } from "../service-broker"

describe("cross-process HTTP RPC", () => {
  afterEach(() => {
    resetBroker()
  })

  it("keeps all-in-one local and split pay on its upstream", () => {
    expect(rpcHttpPath()).toBe("/api/internal/rpc")
    expect(resolveRpcBaseUrl("pay", {})).toBeUndefined()
    expect(resolveRpcBaseUrl("pay", { RUOYI_DOMAIN_PAY_UPSTREAM: "http://pay:3100/" })).toBe("http://pay:3100")
    expect(resolveRpcBaseUrl("mall", { RUOYI_PACK_DOMAIN: "pay", RUOYI_RPC_GATEWAY: "http://bff:3100" })).toBe("http://bff:3100")
  })

  it("serves local ping and rejects other domains on a packed process", async () => {
    const env = { RUOYI_PACK_DOMAIN: "pay", RUOYI_RPC_TOKEN: "secret" }
    const ok = await handleInternalRpc({
      domain: "pay",
      method: "ping",
      payload: { n: 1 },
      headers: { "x-ruoyi-rpc-token": "secret" },
      env,
    })
    expect(ok).toEqual({ success: true, data: { pong: true, domain: "pay", n: 1 } })
    const rejected = await handleInternalRpc({
      domain: "mall",
      method: "ping",
      payload: {},
      headers: { "x-ruoyi-rpc-token": "secret" },
      env,
    })
    expect(rejected.success).toBe(false)
    if (rejected.success) throw new Error("expected failure")
    expect(rejected.error).toMatch(/ServiceNotLocal/)
    expect(rejected.status).toBe(404)
  })

  it("rejects a bad RPC token", async () => {
    const denied = await handleInternalRpc({
      domain: "pay",
      method: "ping",
      payload: {},
      headers: { "x-ruoyi-rpc-token": "nope" },
      env: { RUOYI_PACK_DOMAIN: "pay", RUOYI_RPC_TOKEN: "secret" },
    })
    expect(denied.success).toBe(false)
    if (denied.success) throw new Error("expected failure")
    expect(denied.status).toBe(401)
  })
})
