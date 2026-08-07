import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesMdItemBatchConfigItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesMdItemBatchConfigCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesMdItemBatchConfigUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesMdItemBatchConfigPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesMdItemBatchConfigItem[] = [
  { id: "mes-md-item-batch-config-001", name: "MesMdItemBatchConfig 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-md-item-batch-config-002", name: "MesMdItemBatchConfig 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesMdItemBatchConfigService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesMdItemBatchConfig不存在")
    domainLog.event("mes.mesMdItemBatchConfig.get", { id })
    return item
  }
}
