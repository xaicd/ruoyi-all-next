import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesWmWarehouseAreaItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesWmWarehouseAreaCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmWarehouseAreaUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmWarehouseAreaPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesWmWarehouseAreaItem[] = [
  { id: "mes-wm-warehouse-area-001", name: "MesWmWarehouseArea 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-wm-warehouse-area-002", name: "MesWmWarehouseArea 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesWmWarehouseAreaService {
  /** 分页查询 */
  static async page(input: MesWmWarehouseAreaPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesWmWarehouseArea.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesWmWarehouseArea不存在")
    domainLog.event("mes.mesWmWarehouseArea.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesWmWarehouseAreaCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-wm-warehouse-area-${++nextId}`
    const item: MesWmWarehouseAreaItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesWmWarehouseArea.create", { id })
    domainLog.audit("mes.mesWmWarehouseArea.create", { targetType: "MES_MESWMWAREHOUSEAREA", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesWmWarehouseAreaUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesWmWarehouseArea不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesWmWarehouseArea.update", { id: input.id })
    domainLog.audit("mes.mesWmWarehouseArea.update", { targetType: "MES_MESWMWAREHOUSEAREA", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesWmWarehouseArea不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesWmWarehouseArea.delete", { id })
    domainLog.audit("mes.mesWmWarehouseArea.delete", { targetType: "MES_MESWMWAREHOUSEAREA", targetId: id })
    return true
  }
}
