import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesCalPlanShiftItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesCalPlanShiftCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesCalPlanShiftUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesCalPlanShiftPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesCalPlanShiftItem[] = [
  { id: "mes-cal-plan-shift-001", name: "MesCalPlanShift 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-cal-plan-shift-002", name: "MesCalPlanShift 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesCalPlanShiftService {
  /** 分页查询 */
  static async page(input: MesCalPlanShiftPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesCalPlanShift.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesCalPlanShift不存在")
    domainLog.event("mes.mesCalPlanShift.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesCalPlanShiftCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-cal-plan-shift-${++nextId}`
    const item: MesCalPlanShiftItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesCalPlanShift.create", { id })
    domainLog.audit("mes.mesCalPlanShift.create", { targetType: "MES_MESCALPLANSHIFT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesCalPlanShiftUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesCalPlanShift不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesCalPlanShift.update", { id: input.id })
    domainLog.audit("mes.mesCalPlanShift.update", { targetType: "MES_MESCALPLANSHIFT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesCalPlanShift不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesCalPlanShift.delete", { id })
    domainLog.audit("mes.mesCalPlanShift.delete", { targetType: "MES_MESCALPLANSHIFT", targetId: id })
    return true
  }
}
