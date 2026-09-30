import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type CrmPermissionItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type CrmPermissionCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmPermissionUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmPermissionPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: CrmPermissionItem[] = [
  { id: "crm-permission-001", name: "CrmPermission 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "crm-permission-002", name: "CrmPermission 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class CrmPermissionService {
  /** 分页查询 */
  static async page(input: CrmPermissionPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("crm.crmPermission.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("CrmPermission不存在")
    domainLog.event("crm.crmPermission.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: CrmPermissionCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `crm-permission-${++nextId}`
    const item: CrmPermissionItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("crm.crmPermission.create", { id })
    domainLog.audit("crm.crmPermission.create", { targetType: "CRM_CRMPERMISSION", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: CrmPermissionUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("CrmPermission不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("crm.crmPermission.update", { id: input.id })
    domainLog.audit("crm.crmPermission.update", { targetType: "CRM_CRMPERMISSION", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("CrmPermission不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("crm.crmPermission.delete", { id })
    domainLog.audit("crm.crmPermission.delete", { targetType: "CRM_CRMPERMISSION", targetId: id })
    return true
  }
}
