import type { AiPageQueryInput, AiModelCreateInput, AiChatDeleteInput } from "../validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import type { BrokerCallResult } from "@/modules/shared/backend/lib/broker-context"
import { aigwFacade } from "@/modules/aigw/contract/aigw.facade"

/**
 * 解包跨域 facade 返回值。
 *
 * Domain Facade 返回的是 `BrokerCallResult` 信封（success/data/error/traceId），
 * 不是业务结果本身。跨域调用必须显式解包并把失败转成异常 —— 否则失败会被当成
 * "拿到一个信封对象"静默吞掉。（同一模式见 infra/backend/services/codegen-table.service.ts）
 */
async function unwrapFacade<T>(result: BrokerCallResult, message: string): Promise<T> {
  if (!result.success) throw new Error(`${message}: ${result.error ?? "未知错误"}`)
  return result.data as T
}


type AiModel = {
  id: string
  name: string
  platform: string
  model: string
  apiUrl?: string
  temperature: number
  maxTokens: number
  enabled: boolean
  createdAt: string
}

type AiChat = {
  id: string
  modelId: string
  userId: string
  title: string
  messageCount: number
  createdAt: string
}

const MOCK_AI_MODELS: AiModel[] = [
  { id: "ai-model-001", name: "GPT-4o", platform: "OPENAI", model: "gpt-4o", temperature: 0.7, maxTokens: 4096, enabled: true, createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "ai-model-002", name: "TongyiQianwen", platform: "TONGYI", model: "qwen-max", temperature: 0.8, maxTokens: 8192, enabled: true, createdAt: "2026-02-01T00:00:00.000Z" },
]

const MOCK_AI_CHATS: AiChat[] = [
  { id: "ai-chat-001", modelId: "ai-model-001", userId: "user-001", title: "ProductAnalysis", messageCount: 12, createdAt: "2026-08-01T10:00:00.000Z" },
  { id: "ai-chat-002", modelId: "ai-model-002", userId: "user-002", title: "CodeReview", messageCount: 5, createdAt: "2026-08-02T14:00:00.000Z" },
]

export class AiService {
  static async listModels(input: AiPageQueryInput) {
    domainLog.event("ai.model.list", { page: input.page, pageSize: input.pageSize, hasKeyword: Boolean(input.keyword) })
    let filtered = [...MOCK_AI_MODELS]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((m) => m.name.toLowerCase().includes(kw) || m.platform.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }

  static async createModel(input: AiModelCreateInput) {
    const exists = MOCK_AI_MODELS.find((m) => m.name === input.name)
    if (exists) throw new Error("模型名称已存在")
    const id = `ai-model-${Date.now()}`
    const model: AiModel = { id, name: input.name, platform: input.platform, model: input.model, apiUrl: input.apiUrl, temperature: input.temperature, maxTokens: input.maxTokens, enabled: true, createdAt: new Date().toISOString() }
    MOCK_AI_MODELS.push(model)
    domainLog.event("ai.model.create", { modelId: id, name: input.name, platform: input.platform })
    domainLog.audit("ai.model.create", { targetType: "AI_MODEL", targetId: id, name: input.name, platform: input.platform })
    return model
  }

  static async listChats(input: AiPageQueryInput) {
    domainLog.event("ai.chat.list", { page: input.page, pageSize: input.pageSize })
    let filtered = [...MOCK_AI_CHATS]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((c) => c.title.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }

  static async deleteChat(input: AiChatDeleteInput) {
    const idx = MOCK_AI_CHATS.findIndex((c) => c.id === input.chatId)
    if (idx === -1) throw new Error("对话记录不存在")
    const [removed] = MOCK_AI_CHATS.splice(idx, 1)
    domainLog.event("ai.chat.delete", { chatId: input.chatId })
    domainLog.audit("ai.chat.delete", { targetType: "AI_CHAT", targetId: input.chatId, title: removed.title })
    return { chatId: input.chatId, deleted: true }
  }

  static async relayChatCompletion(input: {
    apiKey: string
    model: string
    messages: { role: string; content: string }[]
    stream?: boolean
  }) {
    return unwrapFacade(
      await aigwFacade.relayChat(input, { caller: "ai.relayChatCompletion" }),
      "aigw relayChat 调用失败",
    )
  }

  static async listPublicModels() {
    return unwrapFacade(
      await aigwFacade.listPublicModels({}, { caller: "ai.listPublicModels" }),
      "aigw listPublicModels 调用失败",
    )
  }

  static async embed(input: { apiKey: string; model?: string; input: string | string[] }) {
    return unwrapFacade(
      await aigwFacade.embed(input, { caller: "ai.embed" }),
      "aigw embed 调用失败",
    )
  }
}

export * from "./ai-api-key.service"
export * from "./ai-chat-conversation.service"
export * from "./ai-chat-message.service"
export * from "./ai-chat-role.service"
export * from "./ai-image.service"
export * from "./ai-knowledge-document.service"
export * from "./ai-knowledge-segment.service"
export * from "./ai-knowledge.service"
export * from "./ai-mind-map.service"
export * from "./ai-music.service"
export * from "./ai-tool.service"
export * from "./ai-workflow.service"
export * from "./ai-write.service"


