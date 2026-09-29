import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type AiChatConversationItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type AiChatConversationCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type AiChatConversationUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type AiChatConversationPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: AiChatConversationItem[] = [
  { id: "ai-chat-conversation-001", name: "AiChatConversation 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "ai-chat-conversation-002", name: "AiChatConversation 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class AiChatConversationService {
  /** 分页查询 */
  static async page(input: AiChatConversationPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("ai.aiChatConversation.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("AiChatConversation不存在")
    domainLog.event("ai.aiChatConversation.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: AiChatConversationCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `ai-chat-conversation-${++nextId}`
    const item: AiChatConversationItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("ai.aiChatConversation.create", { id })
    domainLog.audit("ai.aiChatConversation.create", { targetType: "AI_AICHATCONVERSATION", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: AiChatConversationUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("AiChatConversation不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("ai.aiChatConversation.update", { id: input.id })
    domainLog.audit("ai.aiChatConversation.update", { targetType: "AI_AICHATCONVERSATION", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("AiChatConversation不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("ai.aiChatConversation.delete", { id })
    domainLog.audit("ai.aiChatConversation.delete", { targetType: "AI_AICHATCONVERSATION", targetId: id })
    return true
  }
}
