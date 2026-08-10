import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type PayRefundItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type PayRefundCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type PayRefundUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type PayRefundPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: PayRefundItem[] = [
  { id: "pay-refund-001", name: "PayRefund 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "pay-refund-002", name: "PayRefund 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class PayRefundService {
  /** 分页查询 */
  static async page(input: PayRefundPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("pay.payRefund.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("PayRefund不存在")
    domainLog.event("pay.payRefund.get", { id })
    return item
  }

  static async update(...args: any[]) { return {} }

  static async delete(...args: any[]) { return {} }

  static async create(...args: any[]) { return {} }
}
