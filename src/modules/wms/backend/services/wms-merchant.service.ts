import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type WmsMerchantItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type WmsMerchantCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type WmsMerchantUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type WmsMerchantPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: WmsMerchantItem[] = [
  { id: "wms-merchant-001", name: "WmsMerchant 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "wms-merchant-002", name: "WmsMerchant 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class WmsMerchantService {
  /** 分页查询 */
  static async page(input: WmsMerchantPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("wms.wmsMerchant.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("WmsMerchant不存在")
    domainLog.event("wms.wmsMerchant.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: WmsMerchantCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `wms-merchant-${++nextId}`
    const item: WmsMerchantItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("wms.wmsMerchant.create", { id })
    domainLog.audit("wms.wmsMerchant.create", { targetType: "WMS_WMSMERCHANT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: WmsMerchantUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("WmsMerchant不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("wms.wmsMerchant.update", { id: input.id })
    domainLog.audit("wms.wmsMerchant.update", { targetType: "WMS_WMSMERCHANT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("WmsMerchant不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("wms.wmsMerchant.delete", { id })
    domainLog.audit("wms.wmsMerchant.delete", { targetType: "WMS_WMSMERCHANT", targetId: id })
    return true
  }
}
