import { describe, it, expect } from "vitest"
import { applyPaidCallback, applyClosedCallback, shouldExpire, canTransition } from "../pay-order-lifecycle"

const order = (status: string) => ({ id: "o1", status })
const ext = (orderId = "o1", status = "WAITING") => ({ id: "e1", orderId, status })

describe("支付订单生命周期（对齐源框架 PayOrderServiceImpl 的不变量）", () => {
  it("首次支付成功: 置为 SUCCESS 且要求发业务事件", () => {
    const r = applyPaidCallback(order("WAITING"), ext())
    expect(r.order.status).toBe("SUCCESS")
    expect(r.duplicate).toBe(false)
    expect(r.emitEvent).toBe(true)
  })

  it("重复回调必须幂等: 不能再发一次业务事件（否则下游重复发货/重复记账）", () => {
    const r = applyPaidCallback(order("SUCCESS"), ext())
    expect(r.duplicate).toBe(true)
    expect(r.emitEvent).toBe(false)
    expect(r.order.status).toBe("SUCCESS")
  })

  it("已支付不因『关闭』通知被降级（全额退款才关闭，且走退款流程）", () => {
    const r = applyClosedCallback(order("SUCCESS"), ext())
    expect(r.outcome).toBe("skipped-paid-no-downgrade")
    expect(r.order.status).toBe("SUCCESS")
  })

  it("已关闭的关闭回调跳过（幂等）", () => {
    expect(applyClosedCallback(order("CLOSED"), ext()).outcome).toBe("skipped-already-closed")
  })

  it("待支付收到关闭回调 -> 关闭", () => {
    expect(applyClosedCallback(order("WAITING"), ext()).order.status).toBe("CLOSED")
  })

  it("非待支付状态的关闭通知是异常，不静默改状态", () => {
    applyPaidCallback(order("WAITING"), ext())
    expect(() => applyClosedCallback(order("REFUNDED"), ext())).toThrow(/只有待支付/)
  })

  it("回调的拓展单必须属于该订单（防串单）", () => {
    expect(() => applyPaidCallback(order("WAITING"), ext("other"))).toThrow(/不属于该订单/)
    expect(() => applyClosedCallback(order("WAITING"), ext("other"))).toThrow(/不属于该订单/)
  })

  it("超时关单只作用于待支付订单", () => {
    const old = new Date(Date.now() - 40 * 60_000).toISOString()
    expect(shouldExpire(order("WAITING"), old, 30)).toBe(true)
    expect(shouldExpire(order("SUCCESS"), old, 30)).toBe(false)
    expect(shouldExpire(order("CLOSED"), old, 30)).toBe(false)
    expect(shouldExpire(order("WAITING"), new Date().toISOString(), 30)).toBe(false)
  })

  it("状态迁移表: 只有 WAITING 能转 SUCCESS，SUCCESS 只能由退款关到 CLOSED", () => {
    expect(canTransition("WAITING", "SUCCESS")).toBe(true)
    expect(canTransition("WAITING", "CLOSED")).toBe(true)
    expect(canTransition("SUCCESS", "CLOSED")).toBe(true)
    expect(canTransition("SUCCESS", "WAITING")).toBe(false)
    expect(canTransition("CLOSED", "SUCCESS")).toBe(false)
  })
})
