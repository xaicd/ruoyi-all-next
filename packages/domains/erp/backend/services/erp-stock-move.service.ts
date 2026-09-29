import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ErpStockMoveItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ErpStockMoveCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ErpStockMoveUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ErpStockMovePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ErpStockMoveItem[] = [
  { id: "erp-stock-move-001", name: "ErpStockMove 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "erp-stock-move-002", name: "ErpStockMove 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ErpStockMoveService {
  /** 分页查询 */
  static async page(input: ErpStockMovePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("erp.erpStockMove.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ErpStockMove不存在")
    domainLog.event("erp.erpStockMove.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: ErpStockMoveCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `erp-stock-move-${++nextId}`
    const item: ErpStockMoveItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("erp.erpStockMove.create", { id })
    domainLog.audit("erp.erpStockMove.create", { targetType: "ERP_ERPSTOCKMOVE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: ErpStockMoveUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("ErpStockMove不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("erp.erpStockMove.update", { id: input.id })
    domainLog.audit("erp.erpStockMove.update", { targetType: "ERP_ERPSTOCKMOVE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("ErpStockMove不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("erp.erpStockMove.delete", { id })
    domainLog.audit("erp.erpStockMove.delete", { targetType: "ERP_ERPSTOCKMOVE", targetId: id })
    return true
  }
}
