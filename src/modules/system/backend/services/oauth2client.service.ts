import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type Oauth2clientItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type Oauth2clientCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type Oauth2clientUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type Oauth2clientPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: Oauth2clientItem[] = [
  { id: "oauth2client-001", name: "Oauth2client 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "oauth2client-002", name: "Oauth2client 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class Oauth2clientService {
  /** 分页查询 */
  static async page(input: Oauth2clientPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("system.oauth2client.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("Oauth2client不存在")
    domainLog.event("system.oauth2client.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: Oauth2clientCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `oauth2client-${++nextId}`
    const item: Oauth2clientItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("system.oauth2client.create", { id })
    domainLog.audit("system.oauth2client.create", { targetType: "SYSTEM_OAUTH2CLIENT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: Oauth2clientUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("Oauth2client不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("system.oauth2client.update", { id: input.id })
    domainLog.audit("system.oauth2client.update", { targetType: "SYSTEM_OAUTH2CLIENT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("Oauth2client不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("system.oauth2client.delete", { id })
    domainLog.audit("system.oauth2client.delete", { targetType: "SYSTEM_OAUTH2CLIENT", targetId: id })
    return true
  }
}
