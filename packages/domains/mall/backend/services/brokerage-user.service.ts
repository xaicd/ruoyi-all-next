import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type BrokerageUserItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type BrokerageUserCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type BrokerageUserUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type BrokerageUserPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: BrokerageUserItem[] = [
  { id: "brokerage-user-001", name: "BrokerageUser 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "brokerage-user-002", name: "BrokerageUser 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class BrokerageUserService {
  /** 分页查询 */
  static async page(input: BrokerageUserPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mall.brokerageUser.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("BrokerageUser不存在")
    domainLog.event("mall.brokerageUser.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: BrokerageUserCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `brokerage-user-${++nextId}`
    const item: BrokerageUserItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mall.brokerageUser.create", { id })
    domainLog.audit("mall.brokerageUser.create", { targetType: "MALL_BROKERAGEUSER", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: BrokerageUserUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("BrokerageUser不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mall.brokerageUser.update", { id: input.id })
    domainLog.audit("mall.brokerageUser.update", { targetType: "MALL_BROKERAGEUSER", targetId: input.id })
    return true
  }

  static async delete(id: string) {
    return { success: true }
  }

}
