import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type AiImageItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type AiImageCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type AiImageUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type AiImagePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: AiImageItem[] = [
  { id: "ai-image-001", name: "AiImage 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "ai-image-002", name: "AiImage 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class AiImageService {
  /** 分页查询 */
  static async page(input: AiImagePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("ai.aiImage.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("AiImage不存在")
    domainLog.event("ai.aiImage.get", { id })
    return item
  }
  /** 更新 */
  static async update(input: AiImageUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("AiImage不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("ai.aiImage.update", { id: input.id })
    domainLog.audit("ai.aiImage.update", { targetType: "AI_AIIMAGE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("AiImage不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("ai.aiImage.delete", { id })
    domainLog.audit("ai.aiImage.delete", { targetType: "AI_AIIMAGE", targetId: id })
    return true
  }
}
