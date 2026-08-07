import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type IotDeviceMessageItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type IotDeviceMessageCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotDeviceMessageUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotDeviceMessagePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: IotDeviceMessageItem[] = [
  { id: "iot-device-message-001", name: "IotDeviceMessage 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "iot-device-message-002", name: "IotDeviceMessage 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class IotDeviceMessageService {
  /** 分页查询 */
  static async page(input: IotDeviceMessagePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("iot.iotDeviceMessage.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("IotDeviceMessage不存在")
    domainLog.event("iot.iotDeviceMessage.get", { id })
    return item
  }
}
