import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type CrmStatisticsRankItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type CrmStatisticsRankCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmStatisticsRankUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmStatisticsRankPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: CrmStatisticsRankItem[] = [
  { id: "crm-statistics-rank-001", name: "CrmStatisticsRank 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "crm-statistics-rank-002", name: "CrmStatisticsRank 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class CrmStatisticsRankService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("CrmStatisticsRank不存在")
    domainLog.event("crm.crmStatisticsRank.get", { id })
    return item
  }
}
