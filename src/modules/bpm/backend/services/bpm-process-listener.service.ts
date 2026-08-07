import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type BpmProcessListenerItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type BpmProcessListenerCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type BpmProcessListenerUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type BpmProcessListenerPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: BpmProcessListenerItem[] = [
  { id: "bpm-process-listener-001", name: "BpmProcessListener 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "bpm-process-listener-002", name: "BpmProcessListener 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class BpmProcessListenerService {
  /** 分页查询 */
  static async page(input: BpmProcessListenerPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("bpm.bpmProcessListener.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("BpmProcessListener不存在")
    domainLog.event("bpm.bpmProcessListener.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: BpmProcessListenerCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `bpm-process-listener-${++nextId}`
    const item: BpmProcessListenerItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("bpm.bpmProcessListener.create", { id })
    domainLog.audit("bpm.bpmProcessListener.create", { targetType: "BPM_BPMPROCESSLISTENER", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: BpmProcessListenerUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("BpmProcessListener不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("bpm.bpmProcessListener.update", { id: input.id })
    domainLog.audit("bpm.bpmProcessListener.update", { targetType: "BPM_BPMPROCESSLISTENER", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("BpmProcessListener不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("bpm.bpmProcessListener.delete", { id })
    domainLog.audit("bpm.bpmProcessListener.delete", { targetType: "BPM_BPMPROCESSLISTENER", targetId: id })
    return true
  }
}
