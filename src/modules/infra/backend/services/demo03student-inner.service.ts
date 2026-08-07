import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type Demo03studentInnerItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type Demo03studentInnerCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type Demo03studentInnerUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type Demo03studentInnerPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: Demo03studentInnerItem[] = [
  { id: "demo03student-inner-001", name: "Demo03studentInner 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "demo03student-inner-002", name: "Demo03studentInner 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class Demo03studentInnerService {
  /** 分页查询 */
  static async page(input: Demo03studentInnerPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("infra.demo03studentInner.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("Demo03studentInner不存在")
    domainLog.event("infra.demo03studentInner.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: Demo03studentInnerCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `demo03student-inner-${++nextId}`
    const item: Demo03studentInnerItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("infra.demo03studentInner.create", { id })
    domainLog.audit("infra.demo03studentInner.create", { targetType: "INFRA_DEMO03STUDENTINNER", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: Demo03studentInnerUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("Demo03studentInner不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("infra.demo03studentInner.update", { id: input.id })
    domainLog.audit("infra.demo03studentInner.update", { targetType: "INFRA_DEMO03STUDENTINNER", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("Demo03studentInner不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("infra.demo03studentInner.delete", { id })
    domainLog.audit("infra.demo03studentInner.delete", { targetType: "INFRA_DEMO03STUDENTINNER", targetId: id })
    return true
  }
}
