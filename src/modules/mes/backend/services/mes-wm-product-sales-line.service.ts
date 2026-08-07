import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesWmProductSalesLineItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesWmProductSalesLineCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmProductSalesLineUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmProductSalesLinePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesWmProductSalesLineItem[] = [
  { id: "mes-wm-product-sales-line-001", name: "MesWmProductSalesLine 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-wm-product-sales-line-002", name: "MesWmProductSalesLine 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesWmProductSalesLineService {
  /** 分页查询 */
  static async page(input: MesWmProductSalesLinePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesWmProductSalesLine.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesWmProductSalesLine不存在")
    domainLog.event("mes.mesWmProductSalesLine.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesWmProductSalesLineCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-wm-product-sales-line-${++nextId}`
    const item: MesWmProductSalesLineItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesWmProductSalesLine.create", { id })
    domainLog.audit("mes.mesWmProductSalesLine.create", { targetType: "MES_MESWMPRODUCTSALESLINE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesWmProductSalesLineUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesWmProductSalesLine不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesWmProductSalesLine.update", { id: input.id })
    domainLog.audit("mes.mesWmProductSalesLine.update", { targetType: "MES_MESWMPRODUCTSALESLINE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesWmProductSalesLine不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesWmProductSalesLine.delete", { id })
    domainLog.audit("mes.mesWmProductSalesLine.delete", { targetType: "MES_MESWMPRODUCTSALESLINE", targetId: id })
    return true
  }
}
