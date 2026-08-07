import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ErpFinancePaymentItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ErpFinancePaymentCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ErpFinancePaymentUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ErpFinancePaymentPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ErpFinancePaymentItem[] = [
  { id: "erp-finance-payment-001", name: "ErpFinancePayment 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "erp-finance-payment-002", name: "ErpFinancePayment 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ErpFinancePaymentService {
  /** 分页查询 */
  static async page(input: ErpFinancePaymentPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("erp.erpFinancePayment.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ErpFinancePayment不存在")
    domainLog.event("erp.erpFinancePayment.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: ErpFinancePaymentCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `erp-finance-payment-${++nextId}`
    const item: ErpFinancePaymentItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("erp.erpFinancePayment.create", { id })
    domainLog.audit("erp.erpFinancePayment.create", { targetType: "ERP_ERPFINANCEPAYMENT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: ErpFinancePaymentUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("ErpFinancePayment不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("erp.erpFinancePayment.update", { id: input.id })
    domainLog.audit("erp.erpFinancePayment.update", { targetType: "ERP_ERPFINANCEPAYMENT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("ErpFinancePayment不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("erp.erpFinancePayment.delete", { id })
    domainLog.audit("erp.erpFinancePayment.delete", { targetType: "ERP_ERPFINANCEPAYMENT", targetId: id })
    return true
  }
}
