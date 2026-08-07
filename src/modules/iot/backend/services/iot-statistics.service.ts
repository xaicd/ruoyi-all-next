import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type IotStatisticsItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type IotStatisticsCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotStatisticsUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotStatisticsPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: IotStatisticsItem[] = [
  { id: "iot-statistics-001", name: "IotStatistics 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "iot-statistics-002", name: "IotStatistics 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class IotStatisticsService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("IotStatistics不存在")
    domainLog.event("iot.iotStatistics.get", { id })
    return item
  }
}
