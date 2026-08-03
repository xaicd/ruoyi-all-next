import { beforeEach, describe, expect, it } from "vitest"
import { clearDomainLogBuffer, getDomainAuditBuffer, getDomainEventBuffer } from "../lib/domain-log"
import { CrmService } from "./crm.service"

describe("crm domain logs", () => {
  beforeEach(() => {
    clearDomainLogBuffer()
  })

  it("writes list events", async () => {
    await CrmService.listCustomers({ page: 1, pageSize: 20, keyword: "" })
    await CrmService.listClues({ page: 1, pageSize: 20, keyword: "" })

    const events = getDomainEventBuffer().map((item) => item.name)
    expect(events).toContain("crm.customer.list")
    expect(events).toContain("crm.clue.list")
  })

  it("writes followup audit", async () => {
    await CrmService.createFollowup({ customerId: "cus-001", content: "电话跟进" })

    const audits = getDomainAuditBuffer().map((item) => item.action)
    expect(audits).toContain("crm.followup.create")
  })
})
