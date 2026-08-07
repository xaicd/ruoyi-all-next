import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type BargainActivityItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type BargainActivityCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type BargainActivityUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type BargainActivityPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: BargainActivityItem[] = [
  { id: "bargain-activity-001", name: "BargainActivity 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "bargain-activity-002", name: "BargainActivity 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class BargainActivityService {
  /** 分页查询 */
  static async page(input: BargainActivityPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mall.bargainActivity.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("BargainActivity不存在")
    domainLog.event("mall.bargainActivity.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: BargainActivityCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `bargain-activity-${++nextId}`
    const item: BargainActivityItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mall.bargainActivity.create", { id })
    domainLog.audit("mall.bargainActivity.create", { targetType: "MALL_BARGAINACTIVITY", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: BargainActivityUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("BargainActivity不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mall.bargainActivity.update", { id: input.id })
    domainLog.audit("mall.bargainActivity.update", { targetType: "MALL_BARGAINACTIVITY", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("BargainActivity不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mall.bargainActivity.delete", { id })
    domainLog.audit("mall.bargainActivity.delete", { targetType: "MALL_BARGAINACTIVITY", targetId: id })
    return true
  }
}
