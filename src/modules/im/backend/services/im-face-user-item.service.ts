import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ImFaceUserItemItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ImFaceUserItemCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImFaceUserItemUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImFaceUserItemPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ImFaceUserItemItem[] = [
  { id: "im-face-user-item-001", name: "ImFaceUserItem 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "im-face-user-item-002", name: "ImFaceUserItem 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ImFaceUserItemService {
  /** 分页查询 */
  static async page(input: ImFaceUserItemPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("im.imFaceUserItem.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ImFaceUserItem不存在")
    domainLog.event("im.imFaceUserItem.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: ImFaceUserItemCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `im-face-user-item-${++nextId}`
    const item: ImFaceUserItemItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("im.imFaceUserItem.create", { id })
    domainLog.audit("im.imFaceUserItem.create", { targetType: "IM_IMFACEUSERITEM", targetId: id })
    return { id }
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("ImFaceUserItem不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("im.imFaceUserItem.delete", { id })
    domainLog.audit("im.imFaceUserItem.delete", { targetType: "IM_IMFACEUSERITEM", targetId: id })
    return true
  }
}
