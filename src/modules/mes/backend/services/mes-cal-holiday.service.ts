import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesCalHolidayItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesCalHolidayCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesCalHolidayUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesCalHolidayPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesCalHolidayItem[] = [
  { id: "mes-cal-holiday-001", name: "MesCalHoliday 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-cal-holiday-002", name: "MesCalHoliday 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesCalHolidayService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesCalHoliday不存在")
    domainLog.event("mes.mesCalHoliday.get", { id })
    return item
  }
}
