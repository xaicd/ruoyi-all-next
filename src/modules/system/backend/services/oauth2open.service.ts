import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type Oauth2openItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type Oauth2openCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type Oauth2openUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type Oauth2openPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: Oauth2openItem[] = [
  { id: "oauth2open-001", name: "Oauth2open 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "oauth2open-002", name: "Oauth2open 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class Oauth2openService {
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("Oauth2open不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("system.oauth2open.delete", { id })
    domainLog.audit("system.oauth2open.delete", { targetType: "SYSTEM_OAUTH2OPEN", targetId: id })
    return true
  }
}
