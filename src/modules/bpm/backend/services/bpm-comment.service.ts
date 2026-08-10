import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type BpmCommentItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type BpmCommentCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type BpmCommentUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type BpmCommentPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: BpmCommentItem[] = [
  { id: "bpm-comment-001", name: "BpmComment 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "bpm-comment-002", name: "BpmComment 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class BpmCommentService {
  /** 分页查询 */
  static async page(input: BpmCommentPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("bpm.bpmComment.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("BpmComment不存在")
    domainLog.event("bpm.bpmComment.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: BpmCommentCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `bpm-comment-${++nextId}`
    const item: BpmCommentItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("bpm.bpmComment.create", { id })
    domainLog.audit("bpm.bpmComment.create", { targetType: "BPM_BPMCOMMENT", targetId: id })
    return { id }
  }

  static async update(...args: any[]) {
    return { id: args[0], ...(args[1] || {}) }
  }

  static async delete(id: string) {
    return { success: true }
  }

}
