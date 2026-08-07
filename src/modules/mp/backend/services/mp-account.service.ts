import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MpAccountItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MpAccountCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MpAccountUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MpAccountPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MpAccountItem[] = [
  { id: "mp-account-001", name: "MpAccount 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mp-account-002", name: "MpAccount 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MpAccountService {
  /** 分页查询 */
  static async page(input: MpAccountPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mp.mpAccount.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MpAccount不存在")
    domainLog.event("mp.mpAccount.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MpAccountCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mp-account-${++nextId}`
    const item: MpAccountItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mp.mpAccount.create", { id })
    domainLog.audit("mp.mpAccount.create", { targetType: "MP_MPACCOUNT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MpAccountUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MpAccount不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mp.mpAccount.update", { id: input.id })
    domainLog.audit("mp.mpAccount.update", { targetType: "MP_MPACCOUNT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MpAccount不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mp.mpAccount.delete", { id })
    domainLog.audit("mp.mpAccount.delete", { targetType: "MP_MPACCOUNT", targetId: id })
    return true
  }
}
