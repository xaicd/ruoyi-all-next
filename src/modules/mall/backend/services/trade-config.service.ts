import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type TradeConfigItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type TradeConfigCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type TradeConfigUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type TradeConfigPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: TradeConfigItem[] = [
  { id: "trade-config-001", name: "TradeConfig 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "trade-config-002", name: "TradeConfig 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class TradeConfigService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("TradeConfig不存在")
    domainLog.event("mall.tradeConfig.get", { id })
    return item
  }
  /** 更新 */
  static async update(input: TradeConfigUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("TradeConfig不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mall.tradeConfig.update", { id: input.id })
    domainLog.audit("mall.tradeConfig.update", { targetType: "MALL_TRADECONFIG", targetId: input.id })
    return true
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
