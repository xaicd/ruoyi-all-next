import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesProRouteProcessItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesProRouteProcessCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesProRouteProcessUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesProRouteProcessPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesProRouteProcessItem[] = [
  { id: "mes-pro-route-process-001", name: "MesProRouteProcess 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-pro-route-process-002", name: "MesProRouteProcess 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesProRouteProcessService {
  /** 分页查询 */
  static async page(input: MesProRouteProcessPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesProRouteProcess.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesProRouteProcess不存在")
    domainLog.event("mes.mesProRouteProcess.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesProRouteProcessCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-pro-route-process-${++nextId}`
    const item: MesProRouteProcessItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesProRouteProcess.create", { id })
    domainLog.audit("mes.mesProRouteProcess.create", { targetType: "MES_MESPROROUTEPROCESS", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesProRouteProcessUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesProRouteProcess不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesProRouteProcess.update", { id: input.id })
    domainLog.audit("mes.mesProRouteProcess.update", { targetType: "MES_MESPROROUTEPROCESS", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesProRouteProcess不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesProRouteProcess.delete", { id })
    domainLog.audit("mes.mesProRouteProcess.delete", { targetType: "MES_MESPROROUTEPROCESS", targetId: id })
    return true
  }
}
