import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ImGroupRequestItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ImGroupRequestCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImGroupRequestUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImGroupRequestPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ImGroupRequestItem[] = [
  { id: "im-group-request-001", name: "ImGroupRequest 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "im-group-request-002", name: "ImGroupRequest 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ImGroupRequestService {
  /** 分页查询 */
  static async page(input: ImGroupRequestPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("im.imGroupRequest.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ImGroupRequest不存在")
    domainLog.event("im.imGroupRequest.get", { id })
    return item
  }
}
