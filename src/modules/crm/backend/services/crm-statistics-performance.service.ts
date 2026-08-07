import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type CrmStatisticsPerformanceItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type CrmStatisticsPerformanceCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmStatisticsPerformanceUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmStatisticsPerformancePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: CrmStatisticsPerformanceItem[] = [
  { id: "crm-statistics-performance-001", name: "CrmStatisticsPerformance 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "crm-statistics-performance-002", name: "CrmStatisticsPerformance 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class CrmStatisticsPerformanceService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("CrmStatisticsPerformance不存在")
    domainLog.event("crm.crmStatisticsPerformance.get", { id })
    return item
  }
}
