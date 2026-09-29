import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type BpmTaskItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type BpmTaskCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type BpmTaskUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type BpmTaskPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: BpmTaskItem[] = [
  { id: "bpm-task-001", name: "BpmTask 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "bpm-task-002", name: "BpmTask 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class BpmTaskService {
  /** 分页查询 */
  static async page(input: BpmTaskPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("bpm.bpmTask.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("BpmTask不存在")
    domainLog.event("bpm.bpmTask.get", { id })
    return item
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("BpmTask不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("bpm.bpmTask.delete", { id })
    domainLog.audit("bpm.bpmTask.delete", { targetType: "BPM_BPMTASK", targetId: id })
    return true
  }

  static async update(...args: any[]) {
    return { id: args[0], ...(args[1] || {}) }
  }

  static async create(input: Record<string, any>) {
    return { id: String(Date.now()), ...input }
  }

}
