import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MemberConfigItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MemberConfigCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MemberConfigUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MemberConfigPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MemberConfigItem[] = [
  { id: "member-config-001", name: "MemberConfig 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "member-config-002", name: "MemberConfig 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MemberConfigService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MemberConfig不存在")
    domainLog.event("member.memberConfig.get", { id })
    return item
  }
}
