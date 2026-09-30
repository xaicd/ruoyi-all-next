import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ImChannelMaterialManagerItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ImChannelMaterialManagerCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImChannelMaterialManagerUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImChannelMaterialManagerPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ImChannelMaterialManagerItem[] = [
  { id: "im-channel-material-manager-001", name: "ImChannelMaterialManager 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "im-channel-material-manager-002", name: "ImChannelMaterialManager 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ImChannelMaterialManagerService {
  /** 分页查询 */
  static async page(input: ImChannelMaterialManagerPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("im.imChannelMaterialManager.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ImChannelMaterialManager不存在")
    domainLog.event("im.imChannelMaterialManager.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: ImChannelMaterialManagerCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `im-channel-material-manager-${++nextId}`
    const item: ImChannelMaterialManagerItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("im.imChannelMaterialManager.create", { id })
    domainLog.audit("im.imChannelMaterialManager.create", { targetType: "IM_IMCHANNELMATERIALMANAGER", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: ImChannelMaterialManagerUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("ImChannelMaterialManager不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("im.imChannelMaterialManager.update", { id: input.id })
    domainLog.audit("im.imChannelMaterialManager.update", { targetType: "IM_IMCHANNELMATERIALMANAGER", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("ImChannelMaterialManager不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("im.imChannelMaterialManager.delete", { id })
    domainLog.audit("im.imChannelMaterialManager.delete", { targetType: "IM_IMCHANNELMATERIALMANAGER", targetId: id })
    return true
  }
}
