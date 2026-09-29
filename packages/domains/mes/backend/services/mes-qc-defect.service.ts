import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesQcDefectItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesQcDefectCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesQcDefectUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesQcDefectPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesQcDefectItem[] = [
  { id: "mes-qc-defect-001", name: "MesQcDefect 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-qc-defect-002", name: "MesQcDefect 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesQcDefectService {
  /** 分页查询 */
  static async page(input: MesQcDefectPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesQcDefect.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesQcDefect不存在")
    domainLog.event("mes.mesQcDefect.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesQcDefectCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-qc-defect-${++nextId}`
    const item: MesQcDefectItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesQcDefect.create", { id })
    domainLog.audit("mes.mesQcDefect.create", { targetType: "MES_MESQCDEFECT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesQcDefectUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesQcDefect不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesQcDefect.update", { id: input.id })
    domainLog.audit("mes.mesQcDefect.update", { targetType: "MES_MESQCDEFECT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesQcDefect不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesQcDefect.delete", { id })
    domainLog.audit("mes.mesQcDefect.delete", { targetType: "MES_MESQCDEFECT", targetId: id })
    return true
  }
}
