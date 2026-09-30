import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type BpmModelItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type BpmModelCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type BpmModelUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type BpmModelPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: BpmModelItem[] = [
  { id: "bpm-model-001", name: "BpmModel 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "bpm-model-002", name: "BpmModel 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class BpmModelService {
  /** 分页查询 */
  static async page(input: BpmModelPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("bpm.bpmModel.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("BpmModel不存在")
    domainLog.event("bpm.bpmModel.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: BpmModelCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `bpm-model-${++nextId}`
    const item: BpmModelItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("bpm.bpmModel.create", { id })
    domainLog.audit("bpm.bpmModel.create", { targetType: "BPM_BPMMODEL", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: BpmModelUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("BpmModel不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("bpm.bpmModel.update", { id: input.id })
    domainLog.audit("bpm.bpmModel.update", { targetType: "BPM_BPMMODEL", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("BpmModel不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("bpm.bpmModel.delete", { id })
    domainLog.audit("bpm.bpmModel.delete", { targetType: "BPM_BPMMODEL", targetId: id })
    return true
  }
}
