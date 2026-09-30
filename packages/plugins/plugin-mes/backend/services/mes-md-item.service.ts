import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesMdItemItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesMdItemCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesMdItemUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesMdItemPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesMdItemItem[] = [
  { id: "mes-md-item-001", name: "MesMdItem 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-md-item-002", name: "MesMdItem 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesMdItemService {
  /** 分页查询 */
  static async page(input: MesMdItemPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesMdItem.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesMdItem不存在")
    domainLog.event("mes.mesMdItem.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesMdItemCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-md-item-${++nextId}`
    const item: MesMdItemItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesMdItem.create", { id })
    domainLog.audit("mes.mesMdItem.create", { targetType: "MES_MESMDITEM", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesMdItemUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesMdItem不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesMdItem.update", { id: input.id })
    domainLog.audit("mes.mesMdItem.update", { targetType: "MES_MESMDITEM", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesMdItem不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesMdItem.delete", { id })
    domainLog.audit("mes.mesMdItem.delete", { targetType: "MES_MESMDITEM", targetId: id })
    return true
  }
}
