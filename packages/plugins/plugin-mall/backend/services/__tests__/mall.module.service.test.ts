import { describe, expect, it } from "vitest"
import { MallService } from ".."

describe("MallService module baseline", () => {
  it("listProducts 返回分页结果", async () => {
    const result = await MallService.listProducts({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(result.items.length).toBeGreaterThan(0)
  })

  it("issueCoupon 发放优惠券", async () => {
    const result = await MallService.issueCoupon({
      couponTemplateId: "tpl-001",
      targetUserId: "mem-001",
      amount: 10,
    })
    expect(result.status).toBe("ISSUED")
    expect(result.amount).toBe(10)
  })
})
