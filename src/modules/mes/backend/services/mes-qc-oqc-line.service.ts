import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesQcOqcLineItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesQcOqcLineCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesQcOqcLineUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesQcOqcLinePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesQcOqcLineItem[] = [
  { id: "mes-qc-oqc-line-001", name: "MesQcOqcLine 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-qc-oqc-line-002", name: "MesQcOqcLine 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesQcOqcLineService {
  /** 分页查询 */
  static async page(input: MesQcOqcLinePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesQcOqcLine.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesQcOqcLine不存在")
    domainLog.event("mes.mesQcOqcLine.get", { id })
    return item
  }

  static async update(...args: any[]) {
    return { id: args[0], ...(args[1] || {}) }
  }

  static async delete(id: string) {
    return { success: true }
  }

  static async create(input: Record<string, any>) {
    return { id: String(Date.now()), ...input }
  }

}
