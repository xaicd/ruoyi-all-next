import { beforeEach, describe, expect, it } from "vitest"
import { clearDomainLogBuffer, getDomainAuditBuffer, getDomainEventBuffer } from "../lib/domain-log"
import { MpService } from "./mp.service"

describe("mp domain logs", () => {
  beforeEach(() => {
    clearDomainLogBuffer()
  })

  it("writes account and fan list events", async () => {
    await MpService.listAccounts({ page: 1, pageSize: 20, keyword: "" })
    await MpService.listFans({ page: 1, pageSize: 20, keyword: "" })

    const events = getDomainEventBuffer().map((item) => item.name)
    expect(events).toContain("mp.account.list")
    expect(events).toContain("mp.fan.list")
  })

  it("writes message send event and audit", async () => {
    await MpService.sendMessage({ accountId: "mp-001", content: "hello" })

    const events = getDomainEventBuffer().map((item) => item.name)
    const audits = getDomainAuditBuffer().map((item) => item.action)
    expect(events).toContain("mp.message.send")
    expect(audits).toContain("mp.message.send")
  })
})
