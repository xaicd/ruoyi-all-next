import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesWmWarehouseItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesWmWarehouseCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmWarehouseUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmWarehousePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesWmWarehouseItem[] = [
  { id: "mes-wm-warehouse-001", name: "MesWmWarehouse 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-wm-warehouse-002", name: "MesWmWarehouse 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesWmWarehouseService {
  /** 分页查询 */
  static async page(input: MesWmWarehousePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesWmWarehouse.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesWmWarehouse不存在")
    domainLog.event("mes.mesWmWarehouse.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesWmWarehouseCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-wm-warehouse-${++nextId}`
    const item: MesWmWarehouseItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesWmWarehouse.create", { id })
    domainLog.audit("mes.mesWmWarehouse.create", { targetType: "MES_MESWMWAREHOUSE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesWmWarehouseUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesWmWarehouse不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesWmWarehouse.update", { id: input.id })
    domainLog.audit("mes.mesWmWarehouse.update", { targetType: "MES_MESWMWAREHOUSE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesWmWarehouse不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesWmWarehouse.delete", { id })
    domainLog.audit("mes.mesWmWarehouse.delete", { targetType: "MES_MESWMWAREHOUSE", targetId: id })
    return true
  }
}
