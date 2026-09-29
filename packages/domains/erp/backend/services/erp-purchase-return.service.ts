import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ErpPurchaseReturnItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ErpPurchaseReturnCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ErpPurchaseReturnUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ErpPurchaseReturnPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ErpPurchaseReturnItem[] = [
  { id: "erp-purchase-return-001", name: "ErpPurchaseReturn 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "erp-purchase-return-002", name: "ErpPurchaseReturn 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ErpPurchaseReturnService {
  /** 分页查询 */
  static async page(input: ErpPurchaseReturnPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("erp.erpPurchaseReturn.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ErpPurchaseReturn不存在")
    domainLog.event("erp.erpPurchaseReturn.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: ErpPurchaseReturnCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `erp-purchase-return-${++nextId}`
    const item: ErpPurchaseReturnItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("erp.erpPurchaseReturn.create", { id })
    domainLog.audit("erp.erpPurchaseReturn.create", { targetType: "ERP_ERPPURCHASERETURN", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: ErpPurchaseReturnUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("ErpPurchaseReturn不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("erp.erpPurchaseReturn.update", { id: input.id })
    domainLog.audit("erp.erpPurchaseReturn.update", { targetType: "ERP_ERPPURCHASERETURN", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("ErpPurchaseReturn不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("erp.erpPurchaseReturn.delete", { id })
    domainLog.audit("erp.erpPurchaseReturn.delete", { targetType: "ERP_ERPPURCHASERETURN", targetId: id })
    return true
  }
}
