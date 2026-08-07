import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type WmsCheckOrderDetailItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type WmsCheckOrderDetailCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type WmsCheckOrderDetailUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type WmsCheckOrderDetailPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: WmsCheckOrderDetailItem[] = [
  { id: "wms-check-order-detail-001", name: "WmsCheckOrderDetail 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "wms-check-order-detail-002", name: "WmsCheckOrderDetail 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class WmsCheckOrderDetailService {
  /** 分页查询 */
  static async page(input: WmsCheckOrderDetailPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("wms.wmsCheckOrderDetail.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("WmsCheckOrderDetail不存在")
    domainLog.event("wms.wmsCheckOrderDetail.get", { id })
    return item
  }
}
