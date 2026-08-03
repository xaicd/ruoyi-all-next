import { beforeEach, describe, expect, it } from "vitest"
import { clearDomainLogBuffer, getDomainAuditBuffer, getDomainEventBuffer } from "../lib/domain-log"
import { InfraConfigService } from "./infra-config.service"
import { InfraJobCenterService } from "./infra-job-center.service"
import { InfraApiLogService } from "./infra-api-log.service"
import { InfraJobLogService } from "./infra-job-log.service"
import { InfraApiErrorLogService } from "./infra-api-error-log.service"
import { InfraRedisService } from "./infra-redis.service"
import { InfraFileService } from "./infra-file.service"
import { InfraFileConfigService } from "./infra-file-config.service"
import { InfraDbConfigService } from "./infra-db-config.service"
import { InfraCodegenService } from "./infra-codegen.service"

describe("infra domain logs", () => {
  beforeEach(() => {
    clearDomainLogBuffer()
  })

  it("writes list events", async () => {
    await InfraConfigService.list({ page: 1, pageSize: 20, keyword: "system" })
    await InfraJobCenterService.list({ page: 1, pageSize: 20, keyword: "wallet" })
    await InfraJobLogService.list({ page: 1, pageSize: 20, keyword: "job" })
    await InfraApiLogService.list({ page: 1, pageSize: 20, keyword: "api/admin" })
    await InfraApiErrorLogService.list({ page: 1, pageSize: 20, keyword: "infra" })
    await InfraRedisService.metrics()
    await InfraFileService.list({ page: 1, pageSize: 20, keyword: "file" })
    await InfraFileConfigService.list({ page: 1, pageSize: 20, keyword: "LOCAL" })
    await InfraDbConfigService.list({ page: 1, pageSize: 20, keyword: "主库" })
    await InfraCodegenService.list({ page: 1, pageSize: 20, keyword: "system" })

    const events = getDomainEventBuffer().map((item) => item.name)
    expect(events).toContain("infra.config.list")
    expect(events).toContain("infra.job.list")
    expect(events).toContain("infra.job-log.list")
    expect(events).toContain("infra.api-log.list")
    expect(events).toContain("infra.api-error-log.list")
    expect(events).toContain("infra.redis.metrics")
    expect(events).toContain("infra.file.list")
    expect(events).toContain("infra.file-config.list")
    expect(events).toContain("infra.db-config.list")
    expect(events).toContain("infra.codegen.list")
  })

  it("writes operation audits", async () => {
    await InfraConfigService.save({ key: "system.site_name", value: "RuoYi", remark: "update" })
    await InfraJobCenterService.trigger({ jobId: "job-001", action: "pause" })

    const audits = getDomainAuditBuffer().map((item) => item.action)
    expect(audits).toContain("infra.config.update")
    expect(audits).toContain("infra.job.operate")
  })
})
