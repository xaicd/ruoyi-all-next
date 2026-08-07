import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ErpPurchaseOrderItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ErpPurchaseOrderCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ErpPurchaseOrderUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ErpPurchaseOrderPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ErpPurchaseOrderItem[] = [
  { id: "erp-purchase-order-001", name: "ErpPurchaseOrder 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "erp-purchase-order-002", name: "ErpPurchaseOrder 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ErpPurchaseOrderService {
  /** 分页查询 */
  static async page(input: ErpPurchaseOrderPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("erp.erpPurchaseOrder.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ErpPurchaseOrder不存在")
    domainLog.event("erp.erpPurchaseOrder.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: ErpPurchaseOrderCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `erp-purchase-order-${++nextId}`
    const item: ErpPurchaseOrderItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("erp.erpPurchaseOrder.create", { id })
    domainLog.audit("erp.erpPurchaseOrder.create", { targetType: "ERP_ERPPURCHASEORDER", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: ErpPurchaseOrderUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("ErpPurchaseOrder不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("erp.erpPurchaseOrder.update", { id: input.id })
    domainLog.audit("erp.erpPurchaseOrder.update", { targetType: "ERP_ERPPURCHASEORDER", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("ErpPurchaseOrder不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("erp.erpPurchaseOrder.delete", { id })
    domainLog.audit("erp.erpPurchaseOrder.delete", { targetType: "ERP_ERPPURCHASEORDER", targetId: id })
    return true
  }
}
