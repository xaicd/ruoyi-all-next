import { describe, expect, it } from "vitest"
import { cronMatches } from "../cron-match"
import { executeJob, resetJobRuntime } from "../job-runtime"
import { InfraJobService } from "../../services/job.service"
import { InfraJobLogRepository, resetJobLogMemory } from "../../repositories/job-log.repository"

describe("job runtime", () => {
  it("matches unix and quartz cron expressions", () => {
    const noon = new Date("2026-08-22T12:00:00")
    expect(cronMatches("0 12 * * *", noon)).toBe(true)
    expect(cronMatches("0 0 12 * * ?", noon)).toBe(true)
    expect(cronMatches("0 11 * * *", noon)).toBe(false)
  })

  it("trigger executes a registered handler and writes a log", async () => {
    resetJobRuntime()
    resetJobLogMemory()
    const created = await InfraJobService.create({
      name: "session-cleanup",
      handlerName: "sessionCleanupHandler",
      cronExpression: "0 0 2 * * ?",
    })
    const result = await InfraJobService.trigger(created.id)
    expect(result.success).toBe(true)
    const logs = await InfraJobLogRepository.page({ page: 1, pageSize: 10, jobId: created.id })
    expect(logs.total).toBe(1)
    expect(logs.items[0]?.status).toBe("SUCCESS")
    await executeJob({
      id: created.id, name: "x", handlerName: "missingHandler", handlerParam: null, cronExpression: "* * * * *",
      retryCount: 0, retryInterval: 0, status: "ACTIVE", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    })
    const failed = await InfraJobLogRepository.page({ page: 1, pageSize: 10, jobId: created.id })
    expect(failed.items.some((item) => item.status === "FAIL")).toBe(true)
  })
})
