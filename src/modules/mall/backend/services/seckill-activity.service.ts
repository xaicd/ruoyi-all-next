import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type SeckillActivityItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type SeckillActivityCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type SeckillActivityUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type SeckillActivityPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: SeckillActivityItem[] = [
  { id: "seckill-activity-001", name: "SeckillActivity 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "seckill-activity-002", name: "SeckillActivity 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class SeckillActivityService {
  /** 分页查询 */
  static async page(input: SeckillActivityPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mall.seckillActivity.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("SeckillActivity不存在")
    domainLog.event("mall.seckillActivity.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: SeckillActivityCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `seckill-activity-${++nextId}`
    const item: SeckillActivityItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mall.seckillActivity.create", { id })
    domainLog.audit("mall.seckillActivity.create", { targetType: "MALL_SECKILLACTIVITY", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: SeckillActivityUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("SeckillActivity不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mall.seckillActivity.update", { id: input.id })
    domainLog.audit("mall.seckillActivity.update", { targetType: "MALL_SECKILLACTIVITY", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("SeckillActivity不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mall.seckillActivity.delete", { id })
    domainLog.audit("mall.seckillActivity.delete", { targetType: "MALL_SECKILLACTIVITY", targetId: id })
    return true
  }
}
