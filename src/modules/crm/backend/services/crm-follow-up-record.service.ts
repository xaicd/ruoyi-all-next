import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type CrmFollowUpRecordItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type CrmFollowUpRecordCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmFollowUpRecordUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmFollowUpRecordPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: CrmFollowUpRecordItem[] = [
  { id: "crm-follow-up-record-001", name: "CrmFollowUpRecord 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "crm-follow-up-record-002", name: "CrmFollowUpRecord 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class CrmFollowUpRecordService {
  /** 分页查询 */
  static async page(input: CrmFollowUpRecordPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("crm.crmFollowUpRecord.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("CrmFollowUpRecord不存在")
    domainLog.event("crm.crmFollowUpRecord.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: CrmFollowUpRecordCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `crm-follow-up-record-${++nextId}`
    const item: CrmFollowUpRecordItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("crm.crmFollowUpRecord.create", { id })
    domainLog.audit("crm.crmFollowUpRecord.create", { targetType: "CRM_CRMFOLLOWUPRECORD", targetId: id })
    return { id }
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("CrmFollowUpRecord不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("crm.crmFollowUpRecord.delete", { id })
    domainLog.audit("crm.crmFollowUpRecord.delete", { targetType: "CRM_CRMFOLLOWUPRECORD", targetId: id })
    return true
  }
}
