import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesProWorkOrderItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesProWorkOrderCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesProWorkOrderUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesProWorkOrderPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesProWorkOrderItem[] = [
  { id: "mes-pro-work-order-001", name: "MesProWorkOrder 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-pro-work-order-002", name: "MesProWorkOrder 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesProWorkOrderService {
  /** 分页查询 */
  static async page(input: MesProWorkOrderPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesProWorkOrder.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesProWorkOrder不存在")
    domainLog.event("mes.mesProWorkOrder.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesProWorkOrderCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-pro-work-order-${++nextId}`
    const item: MesProWorkOrderItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesProWorkOrder.create", { id })
    domainLog.audit("mes.mesProWorkOrder.create", { targetType: "MES_MESPROWORKORDER", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesProWorkOrderUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesProWorkOrder不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesProWorkOrder.update", { id: input.id })
    domainLog.audit("mes.mesProWorkOrder.update", { targetType: "MES_MESPROWORKORDER", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesProWorkOrder不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesProWorkOrder.delete", { id })
    domainLog.audit("mes.mesProWorkOrder.delete", { targetType: "MES_MESPROWORKORDER", targetId: id })
    return true
  }
}
