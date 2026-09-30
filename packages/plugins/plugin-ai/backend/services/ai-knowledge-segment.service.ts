import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type AiKnowledgeSegmentItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type AiKnowledgeSegmentCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type AiKnowledgeSegmentUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type AiKnowledgeSegmentPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: AiKnowledgeSegmentItem[] = [
  { id: "ai-knowledge-segment-001", name: "AiKnowledgeSegment 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "ai-knowledge-segment-002", name: "AiKnowledgeSegment 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class AiKnowledgeSegmentService {
  /** 分页查询 */
  static async page(input: AiKnowledgeSegmentPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("ai.aiKnowledgeSegment.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("AiKnowledgeSegment不存在")
    domainLog.event("ai.aiKnowledgeSegment.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: AiKnowledgeSegmentCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `ai-knowledge-segment-${++nextId}`
    const item: AiKnowledgeSegmentItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("ai.aiKnowledgeSegment.create", { id })
    domainLog.audit("ai.aiKnowledgeSegment.create", { targetType: "AI_AIKNOWLEDGESEGMENT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: AiKnowledgeSegmentUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("AiKnowledgeSegment不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("ai.aiKnowledgeSegment.update", { id: input.id })
    domainLog.audit("ai.aiKnowledgeSegment.update", { targetType: "AI_AIKNOWLEDGESEGMENT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("AiKnowledgeSegment不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("ai.aiKnowledgeSegment.delete", { id })
    domainLog.audit("ai.aiKnowledgeSegment.delete", { targetType: "AI_AIKNOWLEDGESEGMENT", targetId: id })
    return true
  }
}
