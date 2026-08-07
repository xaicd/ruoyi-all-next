import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesDvRepairLineItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesDvRepairLineCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesDvRepairLineUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesDvRepairLinePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesDvRepairLineItem[] = [
  { id: "mes-dv-repair-line-001", name: "MesDvRepairLine 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-dv-repair-line-002", name: "MesDvRepairLine 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesDvRepairLineService {
  /** 分页查询 */
  static async page(input: MesDvRepairLinePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesDvRepairLine.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesDvRepairLine不存在")
    domainLog.event("mes.mesDvRepairLine.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesDvRepairLineCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-dv-repair-line-${++nextId}`
    const item: MesDvRepairLineItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesDvRepairLine.create", { id })
    domainLog.audit("mes.mesDvRepairLine.create", { targetType: "MES_MESDVREPAIRLINE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesDvRepairLineUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesDvRepairLine不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesDvRepairLine.update", { id: input.id })
    domainLog.audit("mes.mesDvRepairLine.update", { targetType: "MES_MESDVREPAIRLINE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesDvRepairLine不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesDvRepairLine.delete", { id })
    domainLog.audit("mes.mesDvRepairLine.delete", { targetType: "MES_MESDVREPAIRLINE", targetId: id })
    return true
  }
}
