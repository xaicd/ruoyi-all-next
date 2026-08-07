import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type AreaItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type AreaCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type AreaUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type AreaPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: AreaItem[] = [
  { id: "area-001", name: "Area 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "area-002", name: "Area 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class AreaService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("Area不存在")
    domainLog.event("system.area.get", { id })
    return item
  }
}
