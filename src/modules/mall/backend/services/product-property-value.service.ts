import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ProductPropertyValueItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ProductPropertyValueCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ProductPropertyValueUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ProductPropertyValuePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ProductPropertyValueItem[] = [
  { id: "product-property-value-001", name: "ProductPropertyValue 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "product-property-value-002", name: "ProductPropertyValue 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ProductPropertyValueService {
  /** 分页查询 */
  static async page(input: ProductPropertyValuePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mall.productPropertyValue.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ProductPropertyValue不存在")
    domainLog.event("mall.productPropertyValue.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: ProductPropertyValueCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `product-property-value-${++nextId}`
    const item: ProductPropertyValueItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mall.productPropertyValue.create", { id })
    domainLog.audit("mall.productPropertyValue.create", { targetType: "MALL_PRODUCTPROPERTYVALUE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: ProductPropertyValueUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("ProductPropertyValue不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mall.productPropertyValue.update", { id: input.id })
    domainLog.audit("mall.productPropertyValue.update", { targetType: "MALL_PRODUCTPROPERTYVALUE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("ProductPropertyValue不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mall.productPropertyValue.delete", { id })
    domainLog.audit("mall.productPropertyValue.delete", { targetType: "MALL_PRODUCTPROPERTYVALUE", targetId: id })
    return true
  }
}
