import { beforeEach, describe, expect, it } from "vitest"
import { clearDomainLogBuffer, getDomainAuditBuffer, getDomainEventBuffer } from "../lib/domain-log"
import { BpmProcessService } from "./bpm-process.service"

describe("bpm domain logs", () => {
  beforeEach(() => {
    clearDomainLogBuffer()
  })

  it("writes list events", async () => {
    await BpmProcessService.listDefinitions({ page: 1, pageSize: 20, keyword: "" })
    await BpmProcessService.listTasks({ page: 1, pageSize: 20, keyword: "" })

    const events = getDomainEventBuffer().map((item) => item.name)
    expect(events).toContain("bpm.process-definition.list")
    expect(events).toContain("bpm.task.list")
  })

  it("writes action audit", async () => {
    await BpmProcessService.actionTask({ taskId: "task-001", action: "approve" })

    const audits = getDomainAuditBuffer().map((item) => item.action)
    expect(audits).toContain("bpm.task.action")
  })
})
