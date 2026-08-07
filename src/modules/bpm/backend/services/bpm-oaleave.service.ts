import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type BpmOaleaveItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type BpmOaleaveCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type BpmOaleaveUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type BpmOaleavePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: BpmOaleaveItem[] = [
  { id: "bpm-oaleave-001", name: "BpmOaleave 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "bpm-oaleave-002", name: "BpmOaleave 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class BpmOaleaveService {
  /** 分页查询 */
  static async page(input: BpmOaleavePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("bpm.bpmOaleave.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("BpmOaleave不存在")
    domainLog.event("bpm.bpmOaleave.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: BpmOaleaveCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `bpm-oaleave-${++nextId}`
    const item: BpmOaleaveItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("bpm.bpmOaleave.create", { id })
    domainLog.audit("bpm.bpmOaleave.create", { targetType: "BPM_BPMOALEAVE", targetId: id })
    return { id }
  }
}
