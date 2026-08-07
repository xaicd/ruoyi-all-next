import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ImFacePackItemManagerItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ImFacePackItemManagerCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImFacePackItemManagerUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImFacePackItemManagerPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ImFacePackItemManagerItem[] = [
  { id: "im-face-pack-item-manager-001", name: "ImFacePackItemManager 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "im-face-pack-item-manager-002", name: "ImFacePackItemManager 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ImFacePackItemManagerService {
  /** 分页查询 */
  static async page(input: ImFacePackItemManagerPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("im.imFacePackItemManager.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ImFacePackItemManager不存在")
    domainLog.event("im.imFacePackItemManager.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: ImFacePackItemManagerCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `im-face-pack-item-manager-${++nextId}`
    const item: ImFacePackItemManagerItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("im.imFacePackItemManager.create", { id })
    domainLog.audit("im.imFacePackItemManager.create", { targetType: "IM_IMFACEPACKITEMMANAGER", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: ImFacePackItemManagerUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("ImFacePackItemManager不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("im.imFacePackItemManager.update", { id: input.id })
    domainLog.audit("im.imFacePackItemManager.update", { targetType: "IM_IMFACEPACKITEMMANAGER", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("ImFacePackItemManager不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("im.imFacePackItemManager.delete", { id })
    domainLog.audit("im.imFacePackItemManager.delete", { targetType: "IM_IMFACEPACKITEMMANAGER", targetId: id })
    return true
  }
}
