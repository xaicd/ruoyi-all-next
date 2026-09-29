import { describe, expect, it } from "vitest"
import { PayService } from ".."

describe("PayService module baseline", () => {
  it("listOrders 返回分页结果", async () => {
    const result = await PayService.listOrders({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(result.items.length).toBeGreaterThan(0)
  })

  it("createOrder 新建支付单状态为 WAITING", async () => {
    const result = await PayService.createOrder({
      appId: "app-test",
      channelCode: "MOCK",
      merchantOrderId: `MO-TEST-${Date.now()}`,
      subject: "测试支付",
      amount: 100,
    })
    expect(result.status).toBe("WAITING")
    expect(result.amount).toBe(100)
  })

  it("listRefunds 返回分页结果", async () => {
    const result = await PayService.listRefunds({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThanOrEqual(0)
  })

  it("createRefund 对不存在的支付单抛出错误", async () => {
    await expect(
      PayService.createRefund({
        payOrderId: "not-exist",
        refundAmount: 100,
        reason: "测试",
      }),
    ).rejects.toThrow("支付单不存在")
  })

  it("createRefund 对非SUCCESS状态抛出错误", async () => {
    // pay-order-002 状态是 WAITING
    await expect(
      PayService.createRefund({
        payOrderId: "pay-order-002",
        refundAmount: 100,
        reason: "状态不对",
      }),
    ).rejects.toThrow("仅支付成功的订单可以退款")
  })
})
