import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ErpWarehouseItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ErpWarehouseCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ErpWarehouseUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ErpWarehousePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ErpWarehouseItem[] = [
  { id: "erp-warehouse-001", name: "ErpWarehouse 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "erp-warehouse-002", name: "ErpWarehouse 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ErpWarehouseService {
  /** 分页查询 */
  static async page(input: ErpWarehousePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("erp.erpWarehouse.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ErpWarehouse不存在")
    domainLog.event("erp.erpWarehouse.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: ErpWarehouseCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `erp-warehouse-${++nextId}`
    const item: ErpWarehouseItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("erp.erpWarehouse.create", { id })
    domainLog.audit("erp.erpWarehouse.create", { targetType: "ERP_ERPWAREHOUSE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: ErpWarehouseUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("ErpWarehouse不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("erp.erpWarehouse.update", { id: input.id })
    domainLog.audit("erp.erpWarehouse.update", { targetType: "ERP_ERPWAREHOUSE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("ErpWarehouse不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("erp.erpWarehouse.delete", { id })
    domainLog.audit("erp.erpWarehouse.delete", { targetType: "ERP_ERPWAREHOUSE", targetId: id })
    return true
  }
}
