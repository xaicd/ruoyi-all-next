import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type CrmOperateLogItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type CrmOperateLogCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmOperateLogUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type CrmOperateLogPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: CrmOperateLogItem[] = [
  { id: "crm-operate-log-001", name: "CrmOperateLog 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "crm-operate-log-002", name: "CrmOperateLog 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class CrmOperateLogService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("CrmOperateLog不存在")
    domainLog.event("crm.crmOperateLog.get", { id })
    return item
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

  static async create(input: Record<string, any>) {
    return { id: String(Date.now()), ...input }
  }

}
