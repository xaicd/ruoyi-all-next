import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MemberUserItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MemberUserCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MemberUserUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MemberUserPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MemberUserItem[] = [
  { id: "member-user-001", name: "MemberUser 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "member-user-002", name: "MemberUser 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MemberUserService {
  /** 分页查询 */
  static async page(input: MemberUserPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("member.memberUser.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MemberUser不存在")
    domainLog.event("member.memberUser.get", { id })
    return item
  }
  /** 更新 */
  static async update(input: MemberUserUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MemberUser不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("member.memberUser.update", { id: input.id })
    domainLog.audit("member.memberUser.update", { targetType: "MEMBER_MEMBERUSER", targetId: input.id })
    return true
  }

  static async delete(id: string) {
    return { success: true }
  }

  static async create(input: Record<string, any>) {
    return { id: String(Date.now()), ...input }
  }

}
