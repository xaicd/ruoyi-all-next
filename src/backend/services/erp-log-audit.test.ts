import { beforeEach, describe, expect, it } from "vitest"
import { clearDomainLogBuffer, getDomainAuditBuffer, getDomainEventBuffer } from "../lib/domain-log"
import { ErpService } from "./erp.service"

describe("erp domain logs", () => {
  beforeEach(() => {
    clearDomainLogBuffer()
  })

  it("writes list events", async () => {
    await ErpService.listProducts({ page: 1, pageSize: 20, keyword: "" })
    await ErpService.listOrders({ page: 1, pageSize: 20, keyword: "" })

    const events = getDomainEventBuffer().map((item) => item.name)
    expect(events).toContain("erp.product.list")
    expect(events).toContain("erp.order.list")
  })

  it("writes stock adjust audit", async () => {
    await ErpService.adjustStock({ productId: "erp-p-001", delta: -1, reason: "盘点" })

    const audits = getDomainAuditBuffer().map((item) => item.action)
    expect(audits).toContain("erp.stock.adjust")
  })
})
