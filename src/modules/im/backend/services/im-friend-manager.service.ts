import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ImFriendManagerItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ImFriendManagerCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImFriendManagerUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImFriendManagerPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ImFriendManagerItem[] = [
  { id: "im-friend-manager-001", name: "ImFriendManager 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "im-friend-manager-002", name: "ImFriendManager 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ImFriendManagerService {
  /** 分页查询 */
  static async page(input: ImFriendManagerPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("im.imFriendManager.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ImFriendManager不存在")
    domainLog.event("im.imFriendManager.get", { id })
    return item
  }
}
