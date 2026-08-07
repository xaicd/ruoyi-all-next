import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type CrmCustomerPoolConfigItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type CrmCustomerPoolConfigCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmCustomerPoolConfigUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmCustomerPoolConfigPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: CrmCustomerPoolConfigItem[] = [
  { id: "crm-customer-pool-config-001", name: "CrmCustomerPoolConfig 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "crm-customer-pool-config-002", name: "CrmCustomerPoolConfig 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class CrmCustomerPoolConfigService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("CrmCustomerPoolConfig不存在")
    domainLog.event("crm.crmCustomerPoolConfig.get", { id })
    return item
  }
}
