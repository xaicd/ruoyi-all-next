import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type IotProductCategoryItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type IotProductCategoryCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotProductCategoryUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotProductCategoryPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: IotProductCategoryItem[] = [
  { id: "iot-product-category-001", name: "IotProductCategory 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "iot-product-category-002", name: "IotProductCategory 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class IotProductCategoryService {
  /** 分页查询 */
  static async page(input: IotProductCategoryPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("iot.iotProductCategory.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("IotProductCategory不存在")
    domainLog.event("iot.iotProductCategory.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: IotProductCategoryCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `iot-product-category-${++nextId}`
    const item: IotProductCategoryItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("iot.iotProductCategory.create", { id })
    domainLog.audit("iot.iotProductCategory.create", { targetType: "IOT_IOTPRODUCTCATEGORY", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: IotProductCategoryUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("IotProductCategory不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("iot.iotProductCategory.update", { id: input.id })
    domainLog.audit("iot.iotProductCategory.update", { targetType: "IOT_IOTPRODUCTCATEGORY", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("IotProductCategory不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("iot.iotProductCategory.delete", { id })
    domainLog.audit("iot.iotProductCategory.delete", { targetType: "IOT_IOTPRODUCTCATEGORY", targetId: id })
    return true
  }
}
