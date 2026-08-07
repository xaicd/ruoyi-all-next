import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ErpProductItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ErpProductCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ErpProductUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ErpProductPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ErpProductItem[] = [
  { id: "erp-product-001", name: "ErpProduct 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "erp-product-002", name: "ErpProduct 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ErpProductService {
  /** 分页查询 */
  static async page(input: ErpProductPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("erp.erpProduct.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ErpProduct不存在")
    domainLog.event("erp.erpProduct.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: ErpProductCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `erp-product-${++nextId}`
    const item: ErpProductItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("erp.erpProduct.create", { id })
    domainLog.audit("erp.erpProduct.create", { targetType: "ERP_ERPPRODUCT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: ErpProductUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("ErpProduct不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("erp.erpProduct.update", { id: input.id })
    domainLog.audit("erp.erpProduct.update", { targetType: "ERP_ERPPRODUCT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("ErpProduct不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("erp.erpProduct.delete", { id })
    domainLog.audit("erp.erpProduct.delete", { targetType: "ERP_ERPPRODUCT", targetId: id })
    return true
  }
}
