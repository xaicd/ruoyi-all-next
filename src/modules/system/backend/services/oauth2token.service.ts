import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type Oauth2tokenItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type Oauth2tokenCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type Oauth2tokenUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type Oauth2tokenPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: Oauth2tokenItem[] = [
  { id: "oauth2token-001", name: "Oauth2token 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "oauth2token-002", name: "Oauth2token 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class Oauth2tokenService {
  /** 分页查询 */
  static async page(input: Oauth2tokenPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("system.oauth2token.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("Oauth2token不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("system.oauth2token.delete", { id })
    domainLog.audit("system.oauth2token.delete", { targetType: "SYSTEM_OAUTH2TOKEN", targetId: id })
    return true
  }
}
