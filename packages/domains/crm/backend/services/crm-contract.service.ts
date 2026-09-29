import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type CrmContractItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type CrmContractCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmContractUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmContractPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: CrmContractItem[] = [
  { id: "crm-contract-001", name: "CrmContract 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "crm-contract-002", name: "CrmContract 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class CrmContractService {
  /** 分页查询 */
  static async page(input: CrmContractPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("crm.crmContract.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("CrmContract不存在")
    domainLog.event("crm.crmContract.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: CrmContractCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `crm-contract-${++nextId}`
    const item: CrmContractItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("crm.crmContract.create", { id })
    domainLog.audit("crm.crmContract.create", { targetType: "CRM_CRMCONTRACT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: CrmContractUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("CrmContract不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("crm.crmContract.update", { id: input.id })
    domainLog.audit("crm.crmContract.update", { targetType: "CRM_CRMCONTRACT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("CrmContract不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("crm.crmContract.delete", { id })
    domainLog.audit("crm.crmContract.delete", { targetType: "CRM_CRMCONTRACT", targetId: id })
    return true
  }
}
