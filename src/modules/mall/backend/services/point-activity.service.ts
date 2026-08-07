import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type PointActivityItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type PointActivityCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type PointActivityUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type PointActivityPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: PointActivityItem[] = [
  { id: "point-activity-001", name: "PointActivity 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "point-activity-002", name: "PointActivity 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class PointActivityService {
  /** 分页查询 */
  static async page(input: PointActivityPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mall.pointActivity.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("PointActivity不存在")
    domainLog.event("mall.pointActivity.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: PointActivityCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `point-activity-${++nextId}`
    const item: PointActivityItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mall.pointActivity.create", { id })
    domainLog.audit("mall.pointActivity.create", { targetType: "MALL_POINTACTIVITY", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: PointActivityUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("PointActivity不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mall.pointActivity.update", { id: input.id })
    domainLog.audit("mall.pointActivity.update", { targetType: "MALL_POINTACTIVITY", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("PointActivity不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mall.pointActivity.delete", { id })
    domainLog.audit("mall.pointActivity.delete", { targetType: "MALL_POINTACTIVITY", targetId: id })
    return true
  }
}
