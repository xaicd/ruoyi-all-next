import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MemberLevelItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MemberLevelCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MemberLevelUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MemberLevelPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MemberLevelItem[] = [
  { id: "member-level-001", name: "MemberLevel 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "member-level-002", name: "MemberLevel 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MemberLevelService {
  /** 分页查询 */
  static async page(input: MemberLevelPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("member.memberLevel.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MemberLevel不存在")
    domainLog.event("member.memberLevel.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MemberLevelCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `member-level-${++nextId}`
    const item: MemberLevelItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("member.memberLevel.create", { id })
    domainLog.audit("member.memberLevel.create", { targetType: "MEMBER_MEMBERLEVEL", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MemberLevelUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MemberLevel不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("member.memberLevel.update", { id: input.id })
    domainLog.audit("member.memberLevel.update", { targetType: "MEMBER_MEMBERLEVEL", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MemberLevel不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("member.memberLevel.delete", { id })
    domainLog.audit("member.memberLevel.delete", { targetType: "MEMBER_MEMBERLEVEL", targetId: id })
    return true
  }
}
