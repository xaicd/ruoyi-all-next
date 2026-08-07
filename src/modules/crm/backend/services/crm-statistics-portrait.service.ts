import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type CrmStatisticsPortraitItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type CrmStatisticsPortraitCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmStatisticsPortraitUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmStatisticsPortraitPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: CrmStatisticsPortraitItem[] = [
  { id: "crm-statistics-portrait-001", name: "CrmStatisticsPortrait 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "crm-statistics-portrait-002", name: "CrmStatisticsPortrait 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class CrmStatisticsPortraitService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("CrmStatisticsPortrait不存在")
    domainLog.event("crm.crmStatisticsPortrait.get", { id })
    return item
  }
}
