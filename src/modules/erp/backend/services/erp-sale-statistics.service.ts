import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ErpSaleStatisticsItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ErpSaleStatisticsCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ErpSaleStatisticsUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ErpSaleStatisticsPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ErpSaleStatisticsItem[] = [
  { id: "erp-sale-statistics-001", name: "ErpSaleStatistics 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "erp-sale-statistics-002", name: "ErpSaleStatistics 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ErpSaleStatisticsService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ErpSaleStatistics不存在")
    domainLog.event("erp.erpSaleStatistics.get", { id })
    return item
  }

  static async update(...args: any[]) {
    return { id: args[0], ...(args[1] || {}) }
  }

  static async delete(id: string) {
    return { success: true }
  }

  static async page(...args: any[]) {
    return {}
  }

  static async create(input: Record<string, any>) {
    return { id: String(Date.now()), ...input }
  }

}
