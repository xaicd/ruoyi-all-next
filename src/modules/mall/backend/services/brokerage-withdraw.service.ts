import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type BrokerageWithdrawItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type BrokerageWithdrawCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type BrokerageWithdrawUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type BrokerageWithdrawPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: BrokerageWithdrawItem[] = [
  { id: "brokerage-withdraw-001", name: "BrokerageWithdraw 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "brokerage-withdraw-002", name: "BrokerageWithdraw 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class BrokerageWithdrawService {
  /** 分页查询 */
  static async page(input: BrokerageWithdrawPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mall.brokerageWithdraw.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("BrokerageWithdraw不存在")
    domainLog.event("mall.brokerageWithdraw.get", { id })
    return item
  }

  static async update(...args: any[]) {
    return { id: args[0], ...(args[1] || {}) }
  }

  static async delete(id: string) {
    return { success: true }
  }

  static async create(input: Record<string, any>) {
    return { id: String(Date.now()), ...input }
  }

}
