import { beforeEach, describe, expect, it } from "vitest"
import { clearDomainLogBuffer, getDomainAuditBuffer, getDomainEventBuffer } from "../lib/domain-log"
import { MallService } from "./mall.service"

describe("mall domain logs", () => {
  beforeEach(() => {
    clearDomainLogBuffer()
  })

  it("writes list events", async () => {
    await MallService.listProducts({ page: 1, pageSize: 20, keyword: "" })
    await MallService.listOrders({ page: 1, pageSize: 20, keyword: "" })

    const events = getDomainEventBuffer().map((item) => item.name)
    expect(events).toContain("mall.product.list")
    expect(events).toContain("mall.order.list")
  })

  it("writes issue coupon audit", async () => {
    await MallService.issueCoupon({ couponTemplateId: "tpl-001", targetUserId: "u-001", amount: 2 })

    const audits = getDomainAuditBuffer().map((item) => item.action)
    expect(audits).toContain("mall.coupon.issue")
  })
})
