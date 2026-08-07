import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type IotDeviceModbusPointItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type IotDeviceModbusPointCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotDeviceModbusPointUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotDeviceModbusPointPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: IotDeviceModbusPointItem[] = [
  { id: "iot-device-modbus-point-001", name: "IotDeviceModbusPoint 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "iot-device-modbus-point-002", name: "IotDeviceModbusPoint 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class IotDeviceModbusPointService {
  /** 分页查询 */
  static async page(input: IotDeviceModbusPointPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("iot.iotDeviceModbusPoint.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("IotDeviceModbusPoint不存在")
    domainLog.event("iot.iotDeviceModbusPoint.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: IotDeviceModbusPointCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `iot-device-modbus-point-${++nextId}`
    const item: IotDeviceModbusPointItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("iot.iotDeviceModbusPoint.create", { id })
    domainLog.audit("iot.iotDeviceModbusPoint.create", { targetType: "IOT_IOTDEVICEMODBUSPOINT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: IotDeviceModbusPointUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("IotDeviceModbusPoint不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("iot.iotDeviceModbusPoint.update", { id: input.id })
    domainLog.audit("iot.iotDeviceModbusPoint.update", { targetType: "IOT_IOTDEVICEMODBUSPOINT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("IotDeviceModbusPoint不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("iot.iotDeviceModbusPoint.delete", { id })
    domainLog.audit("iot.iotDeviceModbusPoint.delete", { targetType: "IOT_IOTDEVICEMODBUSPOINT", targetId: id })
    return true
  }
}
