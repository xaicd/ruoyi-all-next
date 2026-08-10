import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type BpmProcessInstanceItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type BpmProcessInstanceCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type BpmProcessInstanceUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type BpmProcessInstancePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: BpmProcessInstanceItem[] = [
  { id: "bpm-process-instance-001", name: "BpmProcessInstance 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "bpm-process-instance-002", name: "BpmProcessInstance 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class BpmProcessInstanceService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("BpmProcessInstance不存在")
    domainLog.event("bpm.bpmProcessInstance.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: BpmProcessInstanceCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `bpm-process-instance-${++nextId}`
    const item: BpmProcessInstanceItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("bpm.bpmProcessInstance.create", { id })
    domainLog.audit("bpm.bpmProcessInstance.create", { targetType: "BPM_BPMPROCESSINSTANCE", targetId: id })
    return { id }
  }

  static async update(...args: any[]) {
    return { id: args[0], ...(args[1] || {}) }
  }

  static async delete(id: string) {
    return { success: true }
  }

  static async page(...args: any[]) {
    return {}
  }

}
