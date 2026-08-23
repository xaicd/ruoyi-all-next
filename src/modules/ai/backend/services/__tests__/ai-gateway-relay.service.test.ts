import { describe, expect, it, beforeEach } from "vitest"
import { aiGatewayStore } from "../ai-gateway.store"
import { AiChannelService } from "../ai-channel.service"
import { AiAccessTokenService } from "../ai-access-token.service"
import { AiGatewayRelayService } from "../ai-gateway-relay.service"
import { AiUsageService } from "../ai-usage.service"

describe("AI 网关（对齐 new-api 能力，自研）", () => {
  beforeEach(() => {
    aiGatewayStore.resetForTest()
  })

  it("演示令牌 + mock 渠道可以转发对话", async () => {
    const result = await AiGatewayRelayService.relayChatCompletion({
      apiKey: "sk-ruoyi-demo-gateway",
      model: "mock-chat",
      messages: [{ role: "user", content: "hello" }],
    })
    expect(result.choices[0]?.message.content).toContain("hello")
    expect(result.usage.total_tokens).toBeGreaterThan(0)
    const logs = await AiUsageService.page({ page: 1, pageSize: 10 })
    expect(logs.total).toBe(1)
    expect(logs.items[0]?.success).toBe(true)
  })

  it("无效令牌返回 401", async () => {
    await expect(
      AiGatewayRelayService.relayChatCompletion({
        apiKey: "sk-bad",
        model: "mock-chat",
        messages: [{ role: "user", content: "x" }],
      }),
    ).rejects.toMatchObject({ status: 401 })
  })

  it("失败渠道自动停用后走下一条", async () => {
    await AiChannelService.create({
      name: "坏渠",
      provider: "CUSTOM",
      baseUrl: "http://127.0.0.1:9",
      apiKey: "sk-x",
      models: ["mock-chat"],
      priority: 99,
      autoDisable: true,
    })
    const result = await AiGatewayRelayService.relayChatCompletion({
      apiKey: "sk-ruoyi-demo-gateway",
      model: "mock-chat",
      messages: [{ role: "user", content: "retry" }],
    })
    expect(result.choices[0]?.message.content).toContain("retry")
  })

  it("新建令牌只回一次明文 key", async () => {
    const created = await AiAccessTokenService.create({ name: "临时令牌" })
    expect(created.key.startsWith("sk-ruoyi-")).toBe(true)
    const page = await AiAccessTokenService.page({ page: 1, pageSize: 20 })
    const listed = page.items.find((item) => item.id === created.id)
    expect(listed?.key).toContain("****")
  })
})
