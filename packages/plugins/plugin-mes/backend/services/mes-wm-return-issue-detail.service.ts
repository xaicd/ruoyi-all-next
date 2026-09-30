import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesWmReturnIssueDetailItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesWmReturnIssueDetailCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmReturnIssueDetailUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmReturnIssueDetailPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesWmReturnIssueDetailItem[] = [
  { id: "mes-wm-return-issue-detail-001", name: "MesWmReturnIssueDetail 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-wm-return-issue-detail-002", name: "MesWmReturnIssueDetail 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesWmReturnIssueDetailService {
  /** 分页查询 */
  static async page(input: MesWmReturnIssueDetailPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesWmReturnIssueDetail.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesWmReturnIssueDetail不存在")
    domainLog.event("mes.mesWmReturnIssueDetail.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesWmReturnIssueDetailCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-wm-return-issue-detail-${++nextId}`
    const item: MesWmReturnIssueDetailItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesWmReturnIssueDetail.create", { id })
    domainLog.audit("mes.mesWmReturnIssueDetail.create", { targetType: "MES_MESWMRETURNISSUEDETAIL", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesWmReturnIssueDetailUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesWmReturnIssueDetail不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesWmReturnIssueDetail.update", { id: input.id })
    domainLog.audit("mes.mesWmReturnIssueDetail.update", { targetType: "MES_MESWMRETURNISSUEDETAIL", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesWmReturnIssueDetail不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesWmReturnIssueDetail.delete", { id })
    domainLog.audit("mes.mesWmReturnIssueDetail.delete", { targetType: "MES_MESWMRETURNISSUEDETAIL", targetId: id })
    return true
  }
}
