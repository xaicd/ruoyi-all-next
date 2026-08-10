import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type PayOrderItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type PayOrderCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type PayOrderUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type PayOrderPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: PayOrderItem[] = [
  { id: "pay-order-001", name: "PayOrder 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "pay-order-002", name: "PayOrder 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class PayOrderService {
  /** 分页查询 */
  static async page(input: PayOrderPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("pay.payOrder.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("PayOrder不存在")
    domainLog.event("pay.payOrder.get", { id })
    return item
  }

  static async update(id: string, input: Record<string, any>) {
    return { id, ...input }
  }

  static async delete(id: string) {
    return { success: true }
  }

  static async create(input: Record<string, any>) {
    return { id: String(Date.now()), ...input }
  }

}
