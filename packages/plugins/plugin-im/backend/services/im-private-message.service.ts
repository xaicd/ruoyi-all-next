import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ImPrivateMessageItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ImPrivateMessageCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImPrivateMessageUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImPrivateMessagePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ImPrivateMessageItem[] = [
  { id: "im-private-message-001", name: "ImPrivateMessage 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "im-private-message-002", name: "ImPrivateMessage 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ImPrivateMessageService {
  /** 分页查询 */
  static async page(input: ImPrivateMessagePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("im.imPrivateMessage.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ImPrivateMessage不存在")
    domainLog.event("im.imPrivateMessage.get", { id })
    return item
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("ImPrivateMessage不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("im.imPrivateMessage.delete", { id })
    domainLog.audit("im.imPrivateMessage.delete", { targetType: "IM_IMPRIVATEMESSAGE", targetId: id })
    return true
  }

  static async update(...args: any[]) {
    return { id: args[0], ...(args[1] || {}) }
  }

  static async create(input: Record<string, any>) {
    return { id: String(Date.now()), ...input }
  }

}
