import { describe, expect, it } from "vitest"
import { InfraConfigService } from "../infra-config.service"
import { InfraJobCenterService } from "../infra-job-center.service"
import { InfraApiLogService } from "../infra-api-log.service"

describe("Infra services", () => {
  it("queries config list", async () => {
    const result = await InfraConfigService.list({ page: 1, pageSize: 10, keyword: "system" })
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(10)
    expect(Array.isArray(result.items)).toBe(true)
  })

  it("triggers job action", async () => {
    const result = await InfraJobCenterService.trigger({ jobId: "job-001", action: "pause" })
    expect(result.id).toBe("job-001")
    expect(result.action).toBe("pause")
  })

  it("queries api logs", async () => {
    const result = await InfraApiLogService.list({ page: 1, pageSize: 10, keyword: "api/admin" })
    expect(result.total).toBeGreaterThanOrEqual(0)
  })
})
