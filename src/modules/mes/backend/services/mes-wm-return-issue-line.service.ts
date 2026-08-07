import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesWmReturnIssueLineItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesWmReturnIssueLineCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmReturnIssueLineUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmReturnIssueLinePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesWmReturnIssueLineItem[] = [
  { id: "mes-wm-return-issue-line-001", name: "MesWmReturnIssueLine 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-wm-return-issue-line-002", name: "MesWmReturnIssueLine 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesWmReturnIssueLineService {
  /** 分页查询 */
  static async page(input: MesWmReturnIssueLinePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesWmReturnIssueLine.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesWmReturnIssueLine不存在")
    domainLog.event("mes.mesWmReturnIssueLine.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesWmReturnIssueLineCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-wm-return-issue-line-${++nextId}`
    const item: MesWmReturnIssueLineItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesWmReturnIssueLine.create", { id })
    domainLog.audit("mes.mesWmReturnIssueLine.create", { targetType: "MES_MESWMRETURNISSUELINE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesWmReturnIssueLineUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesWmReturnIssueLine不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesWmReturnIssueLine.update", { id: input.id })
    domainLog.audit("mes.mesWmReturnIssueLine.update", { targetType: "MES_MESWMRETURNISSUELINE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesWmReturnIssueLine不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesWmReturnIssueLine.delete", { id })
    domainLog.audit("mes.mesWmReturnIssueLine.delete", { targetType: "MES_MESWMRETURNISSUELINE", targetId: id })
    return true
  }
}
