import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type CrmContractConfigItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type CrmContractConfigCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmContractConfigUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmContractConfigPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: CrmContractConfigItem[] = [
  { id: "crm-contract-config-001", name: "CrmContractConfig 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "crm-contract-config-002", name: "CrmContractConfig 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class CrmContractConfigService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("CrmContractConfig不存在")
    domainLog.event("crm.crmContractConfig.get", { id })
    return item
  }
}
