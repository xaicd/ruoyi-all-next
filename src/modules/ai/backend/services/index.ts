import type { AiPageQueryInput, AiModelCreateInput, AiChatDeleteInput } from "../validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { AiGatewayRelayService } from "./ai-gateway-relay.service"

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

  static relayChatCompletion(input: {
    apiKey: string
    model: string
    messages: { role: string; content: string }[]
    stream?: boolean
  }) {
    return AiGatewayRelayService.relayChatCompletion(input)
  }

  static listPublicModels() {
    return AiGatewayRelayService.listPublicModels()
  }

  static embed(input: { apiKey: string; model?: string; input: string | string[] }) {
    return AiGatewayRelayService.embed(input)
  }
}

export { AiChannelService } from "./ai-channel.service"
export { AiAccessTokenService } from "./ai-access-token.service"
export { AiUsageService } from "./ai-usage.service"
export { AiGatewayRelayService } from "./ai-gateway-relay.service"
export { aiGatewayStore } from "./ai-gateway.store"
