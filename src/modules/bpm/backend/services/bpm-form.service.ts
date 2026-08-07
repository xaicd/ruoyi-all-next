import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type BpmFormItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type BpmFormCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type BpmFormUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type BpmFormPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: BpmFormItem[] = [
  { id: "bpm-form-001", name: "BpmForm 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "bpm-form-002", name: "BpmForm 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class BpmFormService {
  /** 分页查询 */
  static async page(input: BpmFormPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("bpm.bpmForm.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("BpmForm不存在")
    domainLog.event("bpm.bpmForm.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: BpmFormCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `bpm-form-${++nextId}`
    const item: BpmFormItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("bpm.bpmForm.create", { id })
    domainLog.audit("bpm.bpmForm.create", { targetType: "BPM_BPMFORM", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: BpmFormUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("BpmForm不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("bpm.bpmForm.update", { id: input.id })
    domainLog.audit("bpm.bpmForm.update", { targetType: "BPM_BPMFORM", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("BpmForm不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("bpm.bpmForm.delete", { id })
    domainLog.audit("bpm.bpmForm.delete", { targetType: "BPM_BPMFORM", targetId: id })
    return true
  }
}
