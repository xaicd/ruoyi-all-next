import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type AiKnowledgeDocumentItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type AiKnowledgeDocumentCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type AiKnowledgeDocumentUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type AiKnowledgeDocumentPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: AiKnowledgeDocumentItem[] = [
  { id: "ai-knowledge-document-001", name: "AiKnowledgeDocument 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "ai-knowledge-document-002", name: "AiKnowledgeDocument 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class AiKnowledgeDocumentService {
  /** 分页查询 */
  static async page(input: AiKnowledgeDocumentPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("ai.aiKnowledgeDocument.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("AiKnowledgeDocument不存在")
    domainLog.event("ai.aiKnowledgeDocument.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: AiKnowledgeDocumentCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `ai-knowledge-document-${++nextId}`
    const item: AiKnowledgeDocumentItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("ai.aiKnowledgeDocument.create", { id })
    domainLog.audit("ai.aiKnowledgeDocument.create", { targetType: "AI_AIKNOWLEDGEDOCUMENT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: AiKnowledgeDocumentUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("AiKnowledgeDocument不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("ai.aiKnowledgeDocument.update", { id: input.id })
    domainLog.audit("ai.aiKnowledgeDocument.update", { targetType: "AI_AIKNOWLEDGEDOCUMENT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("AiKnowledgeDocument不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("ai.aiKnowledgeDocument.delete", { id })
    domainLog.audit("ai.aiKnowledgeDocument.delete", { targetType: "AI_AIKNOWLEDGEDOCUMENT", targetId: id })
    return true
  }
}
