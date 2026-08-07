import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type WmsItemBrandItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type WmsItemBrandCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type WmsItemBrandUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type WmsItemBrandPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: WmsItemBrandItem[] = [
  { id: "wms-item-brand-001", name: "WmsItemBrand 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "wms-item-brand-002", name: "WmsItemBrand 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class WmsItemBrandService {
  /** 分页查询 */
  static async page(input: WmsItemBrandPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("wms.wmsItemBrand.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("WmsItemBrand不存在")
    domainLog.event("wms.wmsItemBrand.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: WmsItemBrandCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `wms-item-brand-${++nextId}`
    const item: WmsItemBrandItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("wms.wmsItemBrand.create", { id })
    domainLog.audit("wms.wmsItemBrand.create", { targetType: "WMS_WMSITEMBRAND", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: WmsItemBrandUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("WmsItemBrand不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("wms.wmsItemBrand.update", { id: input.id })
    domainLog.audit("wms.wmsItemBrand.update", { targetType: "WMS_WMSITEMBRAND", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("WmsItemBrand不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("wms.wmsItemBrand.delete", { id })
    domainLog.audit("wms.wmsItemBrand.delete", { targetType: "WMS_WMSITEMBRAND", targetId: id })
    return true
  }
}
