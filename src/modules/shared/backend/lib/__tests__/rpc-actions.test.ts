import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { listDomainCatalog } from "../../constants/domain-catalog"
import rpcActions from "../../constants/rpc-actions.json"
import { grpcMethodPath } from "../grpc-fabric"

describe("rpc action contracts", () => {
  it("covers every catalog domain", () => {
    const names = listDomainCatalog().map((domain) => domain.name)
    expect(Object.keys(rpcActions.domains).sort()).toEqual([...names].sort())
  })

  it("keeps gRPC paths aligned with generated proto and Go stubs", () => {
    expect(grpcMethodPath("pay", "createOrder")).toBe("/ruoyi.pay.v1.PayService/CreateOrder")
    expect(grpcMethodPath("mall", "issueCoupon")).toBe("/ruoyi.mall.v1.MallService/IssueCoupon")
    expect(rpcActions.domains.pay.actions.map((item) => item.method)).toEqual([
      "ping",
      "listOrders",
      "createOrder",
      "createRefund",
    ])
    const goStub = readFileSync(path.resolve(process.cwd(), "gen/go/pay/v1/service.go"), "utf8")
    expect(goStub).toContain('CreateOrderPath = "/ruoyi.pay.v1.PayService/CreateOrder"')
    expect(goStub).toContain("type PayService interface")
    expect(goStub).toContain("func (c *Client) CreateOrder")
  })
})
