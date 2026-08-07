import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type CrmStatisticsCustomerItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type CrmStatisticsCustomerCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmStatisticsCustomerUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmStatisticsCustomerPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: CrmStatisticsCustomerItem[] = [
  { id: "crm-statistics-customer-001", name: "CrmStatisticsCustomer 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "crm-statistics-customer-002", name: "CrmStatisticsCustomer 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class CrmStatisticsCustomerService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("CrmStatisticsCustomer不存在")
    domainLog.event("crm.crmStatisticsCustomer.get", { id })
    return item
  }
}
