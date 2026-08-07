import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesDvRepairItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesDvRepairCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesDvRepairUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesDvRepairPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesDvRepairItem[] = [
  { id: "mes-dv-repair-001", name: "MesDvRepair 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-dv-repair-002", name: "MesDvRepair 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesDvRepairService {
  /** 分页查询 */
  static async page(input: MesDvRepairPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesDvRepair.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesDvRepair不存在")
    domainLog.event("mes.mesDvRepair.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesDvRepairCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-dv-repair-${++nextId}`
    const item: MesDvRepairItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesDvRepair.create", { id })
    domainLog.audit("mes.mesDvRepair.create", { targetType: "MES_MESDVREPAIR", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesDvRepairUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesDvRepair不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesDvRepair.update", { id: input.id })
    domainLog.audit("mes.mesDvRepair.update", { targetType: "MES_MESDVREPAIR", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesDvRepair不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesDvRepair.delete", { id })
    domainLog.audit("mes.mesDvRepair.delete", { targetType: "MES_MESDVREPAIR", targetId: id })
    return true
  }
}
