import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MpAutoReplyItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MpAutoReplyCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MpAutoReplyUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MpAutoReplyPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MpAutoReplyItem[] = [
  { id: "mp-auto-reply-001", name: "MpAutoReply 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mp-auto-reply-002", name: "MpAutoReply 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MpAutoReplyService {
  /** 分页查询 */
  static async page(input: MpAutoReplyPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mp.mpAutoReply.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MpAutoReply不存在")
    domainLog.event("mp.mpAutoReply.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MpAutoReplyCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mp-auto-reply-${++nextId}`
    const item: MpAutoReplyItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mp.mpAutoReply.create", { id })
    domainLog.audit("mp.mpAutoReply.create", { targetType: "MP_MPAUTOREPLY", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MpAutoReplyUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MpAutoReply不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mp.mpAutoReply.update", { id: input.id })
    domainLog.audit("mp.mpAutoReply.update", { targetType: "MP_MPAUTOREPLY", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MpAutoReply不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mp.mpAutoReply.delete", { id })
    domainLog.audit("mp.mpAutoReply.delete", { targetType: "MP_MPAUTOREPLY", targetId: id })
    return true
  }
}
