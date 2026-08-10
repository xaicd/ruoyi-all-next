import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesHomeStatisticsItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesHomeStatisticsCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesHomeStatisticsUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesHomeStatisticsPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesHomeStatisticsItem[] = [
  { id: "mes-home-statistics-001", name: "MesHomeStatistics 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-home-statistics-002", name: "MesHomeStatistics 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesHomeStatisticsService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesHomeStatistics不存在")
    domainLog.event("mes.mesHomeStatistics.get", { id })
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
