import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type GoViewDataItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type GoViewDataCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type GoViewDataUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type GoViewDataPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: GoViewDataItem[] = [
  { id: "go-view-data-001", name: "GoViewData 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "go-view-data-002", name: "GoViewData 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class GoViewDataService {

  static async get(id: string) {
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

  static async create(input: Record<string, any>) {
    return { id: String(Date.now()), ...input }
  }

}
