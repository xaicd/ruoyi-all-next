import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type DeliveryExpressTemplateItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type DeliveryExpressTemplateCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type DeliveryExpressTemplateUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type DeliveryExpressTemplatePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: DeliveryExpressTemplateItem[] = [
  { id: "delivery-express-template-001", name: "DeliveryExpressTemplate 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "delivery-express-template-002", name: "DeliveryExpressTemplate 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class DeliveryExpressTemplateService {
  /** 分页查询 */
  static async page(input: DeliveryExpressTemplatePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mall.deliveryExpressTemplate.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("DeliveryExpressTemplate不存在")
    domainLog.event("mall.deliveryExpressTemplate.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: DeliveryExpressTemplateCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `delivery-express-template-${++nextId}`
    const item: DeliveryExpressTemplateItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mall.deliveryExpressTemplate.create", { id })
    domainLog.audit("mall.deliveryExpressTemplate.create", { targetType: "MALL_DELIVERYEXPRESSTEMPLATE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: DeliveryExpressTemplateUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("DeliveryExpressTemplate不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mall.deliveryExpressTemplate.update", { id: input.id })
    domainLog.audit("mall.deliveryExpressTemplate.update", { targetType: "MALL_DELIVERYEXPRESSTEMPLATE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("DeliveryExpressTemplate不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mall.deliveryExpressTemplate.delete", { id })
    domainLog.audit("mall.deliveryExpressTemplate.delete", { targetType: "MALL_DELIVERYEXPRESSTEMPLATE", targetId: id })
    return true
  }
}
