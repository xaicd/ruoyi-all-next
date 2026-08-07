import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ErpPurchaseStatisticsItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ErpPurchaseStatisticsCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ErpPurchaseStatisticsUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ErpPurchaseStatisticsPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ErpPurchaseStatisticsItem[] = [
  { id: "erp-purchase-statistics-001", name: "ErpPurchaseStatistics 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "erp-purchase-statistics-002", name: "ErpPurchaseStatistics 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ErpPurchaseStatisticsService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ErpPurchaseStatistics不存在")
    domainLog.event("erp.erpPurchaseStatistics.get", { id })
    return item
  }
}
