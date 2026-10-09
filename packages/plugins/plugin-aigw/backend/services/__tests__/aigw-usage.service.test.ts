import { beforeEach, describe, expect, it } from "vitest"
import { AigwUsageService } from "../aigw-usage.service"
import { AigwAccessTokenService } from "../aigw-access-token.service"
import { aigwStore } from "../aigw.store"
import { runWithTenantContext } from "@/modules/shared/backend/lib/biz-tenant"

describe("AIGW 计量分析与调用日志服务测试", () => {
  beforeEach(() => {
    aigwStore.resetForTest()
  })

  it("正常记录模型调用并计算 token", async () => {
    const record = await AigwUsageService.record({
      tokenId: "token-01",
      channelId: "channel-mock",
      model: "gpt-4o",
      promptTokens: 120,
      completionTokens: 80,
      success: true,
      latencyMs: 340,
    })

    expect(record.id).toBeDefined()
    expect(record.model).toBe("gpt-4o")
    expect(record.promptTokens).toBe(120)
    expect(record.completionTokens).toBe(80)

    const list = await AigwUsageService.page({ page: 1, pageSize: 10, keyword: "gpt-4o" })
    expect(list.items.length).toBeGreaterThan(0)
    const found = list.items.find((item) => item.id === record.id)
    expect(found).toBeDefined()
    expect(found?.success).toBe(true)
  })

  it("支持异常与错误日志追踪", async () => {
    const errorRecord = await AigwUsageService.record({
      tokenId: "token-01",
      channelId: "channel-mock",
      model: "claude-3-5-sonnet",
      promptTokens: 50,
      completionTokens: 0,
      success: false,
      latencyMs: 120,
      error: "Upstream rate limit 429",
    })

    expect(errorRecord.success).toBe(false)
    expect(errorRecord.error).toBe("Upstream rate limit 429")

    const list = await AigwUsageService.page({ page: 1, pageSize: 10, keyword: "claude-3-5-sonnet" })
    const found = list.items.find((item) => item.id === errorRecord.id)
    expect(found?.error).toBe("Upstream rate limit 429")
  })

  it("关联 Token 查询时自动脱敏敏感 Key", async () => {
    const tokenName = `计量测试令牌-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const createdToken = await AigwAccessTokenService.create({ name: tokenName })

    await AigwUsageService.record({
      tokenId: createdToken.id,
      channelId: "channel-mock",
      model: "deepseek-r1",
      promptTokens: 100,
      completionTokens: 200,
      success: true,
      latencyMs: 500,
    })

    const list = await AigwUsageService.page({ page: 1, pageSize: 10, keyword: "deepseek-r1" })
    const item = list.items.find((i) => i.tokenId === createdToken.id)
    expect(item).toBeDefined()
    expect(item?.tokenName).toBe(tokenName)
    expect(item?.tokenKey).toContain("...")
    expect(item?.tokenKey).not.toBe(createdToken.key)

    await AigwAccessTokenService.delete(createdToken.id)
  })

  it("多租户上下文隔离验证", async () => {
    await runWithTenantContext("tenant-a", async () => {
      await AigwUsageService.record({
        tokenId: "token-tenant-a",
        channelId: "channel-mock",
        model: "tenant-a-model",
        promptTokens: 10,
        completionTokens: 10,
        success: true,
        latencyMs: 100,
      })
    })

    const pageTenantA = await runWithTenantContext("tenant-a", async () => {
      return await AigwUsageService.page({ page: 1, pageSize: 20, keyword: "tenant-a-model" })
    })
    expect(pageTenantA.items.length).toBeGreaterThan(0)
  })
})
