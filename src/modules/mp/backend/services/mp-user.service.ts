import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MpUserItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MpUserCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MpUserUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MpUserPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MpUserItem[] = [
  { id: "mp-user-001", name: "MpUser 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mp-user-002", name: "MpUser 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MpUserService {
  /** 分页查询 */
  static async page(input: MpUserPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mp.mpUser.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MpUser不存在")
    domainLog.event("mp.mpUser.get", { id })
    return item
  }
  /** 更新 */
  static async update(input: MpUserUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MpUser不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mp.mpUser.update", { id: input.id })
    domainLog.audit("mp.mpUser.update", { targetType: "MP_MPUSER", targetId: input.id })
    return true
  }
}
