import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type Oauth2userItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type Oauth2userCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type Oauth2userUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type Oauth2userPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: Oauth2userItem[] = [
  { id: "oauth2user-001", name: "Oauth2user 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "oauth2user-002", name: "Oauth2user 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class Oauth2userService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("Oauth2user不存在")
    domainLog.event("system.oauth2user.get", { id })
    return item
  }
  /** 更新 */
  static async update(input: Oauth2userUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("Oauth2user不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("system.oauth2user.update", { id: input.id })
    domainLog.audit("system.oauth2user.update", { targetType: "SYSTEM_OAUTH2USER", targetId: input.id })
    return true
  }
}
