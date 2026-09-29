import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MemberGroupItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MemberGroupCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MemberGroupUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MemberGroupPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MemberGroupItem[] = [
  { id: "member-group-001", name: "MemberGroup 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "member-group-002", name: "MemberGroup 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MemberGroupService {
  /** 分页查询 */
  static async page(input: MemberGroupPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("member.memberGroup.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MemberGroup不存在")
    domainLog.event("member.memberGroup.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MemberGroupCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `member-group-${++nextId}`
    const item: MemberGroupItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("member.memberGroup.create", { id })
    domainLog.audit("member.memberGroup.create", { targetType: "MEMBER_MEMBERGROUP", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MemberGroupUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MemberGroup不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("member.memberGroup.update", { id: input.id })
    domainLog.audit("member.memberGroup.update", { targetType: "MEMBER_MEMBERGROUP", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MemberGroup不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("member.memberGroup.delete", { id })
    domainLog.audit("member.memberGroup.delete", { targetType: "MEMBER_MEMBERGROUP", targetId: id })
    return true
  }
}
