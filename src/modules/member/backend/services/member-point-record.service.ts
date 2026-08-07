import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MemberPointRecordItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MemberPointRecordCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MemberPointRecordUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MemberPointRecordPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MemberPointRecordItem[] = [
  { id: "member-point-record-001", name: "MemberPointRecord 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "member-point-record-002", name: "MemberPointRecord 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MemberPointRecordService {
  /** 分页查询 */
  static async page(input: MemberPointRecordPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("member.memberPointRecord.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MemberPointRecord不存在")
    domainLog.event("member.memberPointRecord.get", { id })
    return item
  }
}
