import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type Demo01contactItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type Demo01contactCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type Demo01contactUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type Demo01contactPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: Demo01contactItem[] = [
  { id: "demo01contact-001", name: "Demo01contact 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "demo01contact-002", name: "Demo01contact 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class Demo01contactService {
  /** 分页查询 */
  static async page(input: Demo01contactPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("infra.demo01contact.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("Demo01contact不存在")
    domainLog.event("infra.demo01contact.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: Demo01contactCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `demo01contact-${++nextId}`
    const item: Demo01contactItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("infra.demo01contact.create", { id })
    domainLog.audit("infra.demo01contact.create", { targetType: "INFRA_DEMO01CONTACT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: Demo01contactUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("Demo01contact不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("infra.demo01contact.update", { id: input.id })
    domainLog.audit("infra.demo01contact.update", { targetType: "INFRA_DEMO01CONTACT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("Demo01contact不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("infra.demo01contact.delete", { id })
    domainLog.audit("infra.demo01contact.delete", { targetType: "INFRA_DEMO01CONTACT", targetId: id })
    return true
  }
}
