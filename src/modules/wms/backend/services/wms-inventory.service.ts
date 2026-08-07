import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type WmsInventoryItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type WmsInventoryCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type WmsInventoryUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type WmsInventoryPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: WmsInventoryItem[] = [
  { id: "wms-inventory-001", name: "WmsInventory 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "wms-inventory-002", name: "WmsInventory 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class WmsInventoryService {
  /** 分页查询 */
  static async page(input: WmsInventoryPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("wms.wmsInventory.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("WmsInventory不存在")
    domainLog.event("wms.wmsInventory.get", { id })
    return item
  }
}
