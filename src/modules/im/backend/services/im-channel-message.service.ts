import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ImChannelMessageItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ImChannelMessageCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImChannelMessageUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImChannelMessagePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ImChannelMessageItem[] = [
  { id: "im-channel-message-001", name: "ImChannelMessage 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "im-channel-message-002", name: "ImChannelMessage 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ImChannelMessageService {
  /** 分页查询 */
  static async page(input: ImChannelMessagePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("im.imChannelMessage.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
}
