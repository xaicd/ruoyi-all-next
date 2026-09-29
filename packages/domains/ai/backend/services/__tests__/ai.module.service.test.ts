import { describe, expect, it } from "vitest"
import { AiService } from ".."

describe("AiService module baseline", () => {
  it("listModels 返回分页结果", async () => {
    const result = await AiService.listModels({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
  })

  it("createModel 重复名称抛出错误", async () => {
    await expect(
      AiService.createModel({
        name: "GPT-4o",
        platform: "OPENAI",
        model: "gpt-4o",
        apiKey: "sk-test",
        temperature: 0.7,
        maxTokens: 4096,
      }),
    ).rejects.toThrow("模型名称已存在")
  })

  it("listChats 返回分页结果", async () => {
    const result = await AiService.listChats({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
  })

  it("deleteChat 不存在时抛出错误", async () => {
    await expect(AiService.deleteChat({ chatId: "not-exist" })).rejects.toThrow("对话记录不存在")
  })
})
