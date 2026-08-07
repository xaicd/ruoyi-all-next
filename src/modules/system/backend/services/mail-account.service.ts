import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MailAccountItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MailAccountCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MailAccountUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MailAccountPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MailAccountItem[] = [
  { id: "mail-account-001", name: "MailAccount 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mail-account-002", name: "MailAccount 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MailAccountService {
  /** 分页查询 */
  static async page(input: MailAccountPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("system.mailAccount.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MailAccount不存在")
    domainLog.event("system.mailAccount.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MailAccountCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mail-account-${++nextId}`
    const item: MailAccountItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("system.mailAccount.create", { id })
    domainLog.audit("system.mailAccount.create", { targetType: "SYSTEM_MAILACCOUNT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MailAccountUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MailAccount不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("system.mailAccount.update", { id: input.id })
    domainLog.audit("system.mailAccount.update", { targetType: "SYSTEM_MAILACCOUNT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MailAccount不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("system.mailAccount.delete", { id })
    domainLog.audit("system.mailAccount.delete", { targetType: "SYSTEM_MAILACCOUNT", targetId: id })
    return true
  }
}
