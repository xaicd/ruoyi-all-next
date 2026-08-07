import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesCalTeamMemberItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesCalTeamMemberCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesCalTeamMemberUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesCalTeamMemberPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesCalTeamMemberItem[] = [
  { id: "mes-cal-team-member-001", name: "MesCalTeamMember 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-cal-team-member-002", name: "MesCalTeamMember 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesCalTeamMemberService {
  /** 分页查询 */
  static async page(input: MesCalTeamMemberPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesCalTeamMember.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesCalTeamMember不存在")
    domainLog.event("mes.mesCalTeamMember.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesCalTeamMemberCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-cal-team-member-${++nextId}`
    const item: MesCalTeamMemberItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesCalTeamMember.create", { id })
    domainLog.audit("mes.mesCalTeamMember.create", { targetType: "MES_MESCALTEAMMEMBER", targetId: id })
    return { id }
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesCalTeamMember不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesCalTeamMember.delete", { id })
    domainLog.audit("mes.mesCalTeamMember.delete", { targetType: "MES_MESCALTEAMMEMBER", targetId: id })
    return true
  }
}
