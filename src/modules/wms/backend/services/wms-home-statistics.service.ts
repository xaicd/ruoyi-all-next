import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type WmsHomeStatisticsItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type WmsHomeStatisticsCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type WmsHomeStatisticsUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type WmsHomeStatisticsPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: WmsHomeStatisticsItem[] = [
  { id: "wms-home-statistics-001", name: "WmsHomeStatistics 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "wms-home-statistics-002", name: "WmsHomeStatistics 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class WmsHomeStatisticsService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("WmsHomeStatistics不存在")
    domainLog.event("wms.wmsHomeStatistics.get", { id })
    return item
  }
}
