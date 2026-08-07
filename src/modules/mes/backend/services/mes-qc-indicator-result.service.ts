import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesQcIndicatorResultItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesQcIndicatorResultCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesQcIndicatorResultUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesQcIndicatorResultPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesQcIndicatorResultItem[] = [
  { id: "mes-qc-indicator-result-001", name: "MesQcIndicatorResult 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-qc-indicator-result-002", name: "MesQcIndicatorResult 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesQcIndicatorResultService {
  /** 分页查询 */
  static async page(input: MesQcIndicatorResultPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesQcIndicatorResult.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesQcIndicatorResult不存在")
    domainLog.event("mes.mesQcIndicatorResult.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesQcIndicatorResultCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-qc-indicator-result-${++nextId}`
    const item: MesQcIndicatorResultItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesQcIndicatorResult.create", { id })
    domainLog.audit("mes.mesQcIndicatorResult.create", { targetType: "MES_MESQCINDICATORRESULT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesQcIndicatorResultUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesQcIndicatorResult不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesQcIndicatorResult.update", { id: input.id })
    domainLog.audit("mes.mesQcIndicatorResult.update", { targetType: "MES_MESQCINDICATORRESULT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesQcIndicatorResult不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesQcIndicatorResult.delete", { id })
    domainLog.audit("mes.mesQcIndicatorResult.delete", { targetType: "MES_MESQCINDICATORRESULT", targetId: id })
    return true
  }
}
