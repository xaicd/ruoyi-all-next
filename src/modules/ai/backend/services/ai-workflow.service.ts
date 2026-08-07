import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type AiWorkflowItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type AiWorkflowCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type AiWorkflowUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type AiWorkflowPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: AiWorkflowItem[] = [
  { id: "ai-workflow-001", name: "AiWorkflow 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "ai-workflow-002", name: "AiWorkflow 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class AiWorkflowService {
  /** 分页查询 */
  static async page(input: AiWorkflowPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("ai.aiWorkflow.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("AiWorkflow不存在")
    domainLog.event("ai.aiWorkflow.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: AiWorkflowCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `ai-workflow-${++nextId}`
    const item: AiWorkflowItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("ai.aiWorkflow.create", { id })
    domainLog.audit("ai.aiWorkflow.create", { targetType: "AI_AIWORKFLOW", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: AiWorkflowUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("AiWorkflow不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("ai.aiWorkflow.update", { id: input.id })
    domainLog.audit("ai.aiWorkflow.update", { targetType: "AI_AIWORKFLOW", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("AiWorkflow不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("ai.aiWorkflow.delete", { id })
    domainLog.audit("ai.aiWorkflow.delete", { targetType: "AI_AIWORKFLOW", targetId: id })
    return true
  }
}
