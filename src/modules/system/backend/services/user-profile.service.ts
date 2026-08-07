import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type UserProfileItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type UserProfileCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type UserProfileUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type UserProfilePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: UserProfileItem[] = [
  { id: "user-profile-001", name: "UserProfile 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "user-profile-002", name: "UserProfile 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class UserProfileService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("UserProfile不存在")
    domainLog.event("system.userProfile.get", { id })
    return item
  }
  /** 更新 */
  static async update(input: UserProfileUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("UserProfile不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("system.userProfile.update", { id: input.id })
    domainLog.audit("system.userProfile.update", { targetType: "SYSTEM_USERPROFILE", targetId: input.id })
    return true
  }
}
