import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type KeFuConversationItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type KeFuConversationCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type KeFuConversationUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type KeFuConversationPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: KeFuConversationItem[] = [
  { id: "ke-fu-conversation-001", name: "KeFuConversation 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "ke-fu-conversation-002", name: "KeFuConversation 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class KeFuConversationService {
  /** 分页查询 */
  static async page(input: KeFuConversationPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mall.keFuConversation.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("KeFuConversation不存在")
    domainLog.event("mall.keFuConversation.get", { id })
    return item
  }
  /** 更新 */
  static async update(input: KeFuConversationUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("KeFuConversation不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mall.keFuConversation.update", { id: input.id })
    domainLog.audit("mall.keFuConversation.update", { targetType: "MALL_KEFUCONVERSATION", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("KeFuConversation不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mall.keFuConversation.delete", { id })
    domainLog.audit("mall.keFuConversation.delete", { targetType: "MALL_KEFUCONVERSATION", targetId: id })
    return true
  }
}
