import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type AiChatRoleItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type AiChatRoleCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type AiChatRoleUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type AiChatRolePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: AiChatRoleItem[] = [
  { id: "ai-chat-role-001", name: "AiChatRole 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "ai-chat-role-002", name: "AiChatRole 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class AiChatRoleService {
  /** 分页查询 */
  static async page(input: AiChatRolePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("ai.aiChatRole.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("AiChatRole不存在")
    domainLog.event("ai.aiChatRole.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: AiChatRoleCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `ai-chat-role-${++nextId}`
    const item: AiChatRoleItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("ai.aiChatRole.create", { id })
    domainLog.audit("ai.aiChatRole.create", { targetType: "AI_AICHATROLE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: AiChatRoleUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("AiChatRole不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("ai.aiChatRole.update", { id: input.id })
    domainLog.audit("ai.aiChatRole.update", { targetType: "AI_AICHATROLE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("AiChatRole不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("ai.aiChatRole.delete", { id })
    domainLog.audit("ai.aiChatRole.delete", { targetType: "AI_AICHATROLE", targetId: id })
    return true
  }
}
