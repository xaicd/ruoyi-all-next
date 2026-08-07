import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type PayDemoOrderItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type PayDemoOrderCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type PayDemoOrderUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type PayDemoOrderPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: PayDemoOrderItem[] = [
  { id: "pay-demo-order-001", name: "PayDemoOrder 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "pay-demo-order-002", name: "PayDemoOrder 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class PayDemoOrderService {
  /** 分页查询 */
  static async page(input: PayDemoOrderPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("pay.payDemoOrder.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("PayDemoOrder不存在")
    domainLog.event("pay.payDemoOrder.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: PayDemoOrderCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `pay-demo-order-${++nextId}`
    const item: PayDemoOrderItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("pay.payDemoOrder.create", { id })
    domainLog.audit("pay.payDemoOrder.create", { targetType: "PAY_PAYDEMOORDER", targetId: id })
    return { id }
  }
}
