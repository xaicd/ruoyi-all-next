import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type CrmContactItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type CrmContactCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmContactUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmContactPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: CrmContactItem[] = [
  { id: "crm-contact-001", name: "CrmContact 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "crm-contact-002", name: "CrmContact 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class CrmContactService {
  /** 分页查询 */
  static async page(input: CrmContactPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("crm.crmContact.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("CrmContact不存在")
    domainLog.event("crm.crmContact.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: CrmContactCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `crm-contact-${++nextId}`
    const item: CrmContactItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("crm.crmContact.create", { id })
    domainLog.audit("crm.crmContact.create", { targetType: "CRM_CRMCONTACT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: CrmContactUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("CrmContact不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("crm.crmContact.update", { id: input.id })
    domainLog.audit("crm.crmContact.update", { targetType: "CRM_CRMCONTACT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("CrmContact不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("crm.crmContact.delete", { id })
    domainLog.audit("crm.crmContact.delete", { targetType: "CRM_CRMCONTACT", targetId: id })
    return true
  }
}
