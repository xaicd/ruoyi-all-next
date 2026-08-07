import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesProCardItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesProCardCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesProCardUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesProCardPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesProCardItem[] = [
  { id: "mes-pro-card-001", name: "MesProCard 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-pro-card-002", name: "MesProCard 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesProCardService {
  /** 分页查询 */
  static async page(input: MesProCardPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesProCard.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesProCard不存在")
    domainLog.event("mes.mesProCard.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesProCardCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-pro-card-${++nextId}`
    const item: MesProCardItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesProCard.create", { id })
    domainLog.audit("mes.mesProCard.create", { targetType: "MES_MESPROCARD", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesProCardUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesProCard不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesProCard.update", { id: input.id })
    domainLog.audit("mes.mesProCard.update", { targetType: "MES_MESPROCARD", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesProCard不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesProCard.delete", { id })
    domainLog.audit("mes.mesProCard.delete", { targetType: "MES_MESPROCARD", targetId: id })
    return true
  }
}
