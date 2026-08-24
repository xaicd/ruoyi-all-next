import { afterEach, describe, expect, it } from "vitest"
import { ruoyiPrisma } from "@/modules/shared/backend/prisma"
import { InfraApiLogService } from "../api-log.service"
import { InfraConfigService } from "../config.service"
import { InfraJobCenterService } from "../job-center.service"

describe("infra services", () => {
  const createdKeys: string[] = []

  afterEach(async () => {
    await ruoyiPrisma.setting.deleteMany({
      where: { key: { in: createdKeys } },
    })
    createdKeys.length = 0
  })

  it("persists config items and lists them from the database", async () => {
    const key = `infra.test.config.${Date.now()}`
    createdKeys.push(key)

    const saved = await InfraConfigService.create({
      name: "测试配置",
      configKey: key,
      value: "persisted-value",
      remark: "from infra test",
    })

    expect(saved.id).toBeDefined()

    const result = await InfraConfigService.list({ page: 1, pageSize: 20, keyword: key })
    expect(result.items.some((item: { configKey: string }) => item.configKey === key)).toBe(true)
  })

  it("reads persisted api logs from the database", async () => {
    await ruoyiPrisma.setting.upsert({
      where: { key: "infra.api-logs" },
      create: {
        key: "infra.api-logs",
        value: {
          items: [
            {
              id: "api-log-1",
              method: "GET",
              path: "/api/admin/infra/configs",
              statusCode: 200,
              durationMs: 19,
              createdAt: new Date().toISOString(),
            },
          ],
        },
      },
      update: {
        value: {
          items: [
            {
              id: "api-log-1",
              method: "GET",
              path: "/api/admin/infra/configs",
              statusCode: 200,
              durationMs: 19,
              createdAt: new Date().toISOString(),
            },
          ],
        },
      },
    })

    const result = await InfraApiLogService.list({ page: 1, pageSize: 20, keyword: "configs" })
    expect(result.items.some((item) => item.path.includes("infra/configs"))).toBe(true)
  })

  it("updates a persisted job state and returns the new state", async () => {
    await ruoyiPrisma.setting.upsert({
      where: { key: "infra.jobs" },
      create: {
        key: "infra.jobs",
        value: {
          items: [
            {
              id: "job-001",
              name: "wallet-settlement",
              cron: "0 2 * * *",
              status: "RUNNING",
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      },
      update: {
        value: {
          items: [
            {
              id: "job-001",
              name: "wallet-settlement",
              cron: "0 2 * * *",
              status: "RUNNING",
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      },
    })

    const result = await InfraJobCenterService.trigger({
      id: "job-001",
      action: "PAUSE",
    })

    expect(result.status).toBe("PAUSED")
    expect(result.id).toBe("job-001")
  })
})
