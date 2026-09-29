import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesMdVendorItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesMdVendorCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesMdVendorUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesMdVendorPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesMdVendorItem[] = [
  { id: "mes-md-vendor-001", name: "MesMdVendor 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-md-vendor-002", name: "MesMdVendor 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesMdVendorService {
  /** 分页查询 */
  static async page(input: MesMdVendorPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesMdVendor.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesMdVendor不存在")
    domainLog.event("mes.mesMdVendor.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesMdVendorCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-md-vendor-${++nextId}`
    const item: MesMdVendorItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesMdVendor.create", { id })
    domainLog.audit("mes.mesMdVendor.create", { targetType: "MES_MESMDVENDOR", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesMdVendorUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesMdVendor不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesMdVendor.update", { id: input.id })
    domainLog.audit("mes.mesMdVendor.update", { targetType: "MES_MESMDVENDOR", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesMdVendor不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesMdVendor.delete", { id })
    domainLog.audit("mes.mesMdVendor.delete", { targetType: "MES_MESMDVENDOR", targetId: id })
    return true
  }
}
