import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type PayStatisticsItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type PayStatisticsCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type PayStatisticsUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type PayStatisticsPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: PayStatisticsItem[] = [
  { id: "pay-statistics-001", name: "PayStatistics 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "pay-statistics-002", name: "PayStatistics 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class PayStatisticsService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("PayStatistics不存在")
    domainLog.event("mall.payStatistics.get", { id })
    return item
  }
}
