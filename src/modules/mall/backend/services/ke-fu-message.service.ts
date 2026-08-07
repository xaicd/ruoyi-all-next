import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type KeFuMessageItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type KeFuMessageCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type KeFuMessageUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type KeFuMessagePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: KeFuMessageItem[] = [
  { id: "ke-fu-message-001", name: "KeFuMessage 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "ke-fu-message-002", name: "KeFuMessage 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class KeFuMessageService {
  /** 分页查询 */
  static async page(input: KeFuMessagePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mall.keFuMessage.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("KeFuMessage不存在")
    domainLog.event("mall.keFuMessage.get", { id })
    return item
  }
  /** 更新 */
  static async update(input: KeFuMessageUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("KeFuMessage不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mall.keFuMessage.update", { id: input.id })
    domainLog.audit("mall.keFuMessage.update", { targetType: "MALL_KEFUMESSAGE", targetId: input.id })
    return true
  }
}
