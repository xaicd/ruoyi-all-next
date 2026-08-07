import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type IotDeviceModbusConfigItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type IotDeviceModbusConfigCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotDeviceModbusConfigUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotDeviceModbusConfigPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: IotDeviceModbusConfigItem[] = [
  { id: "iot-device-modbus-config-001", name: "IotDeviceModbusConfig 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "iot-device-modbus-config-002", name: "IotDeviceModbusConfig 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class IotDeviceModbusConfigService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("IotDeviceModbusConfig不存在")
    domainLog.event("iot.iotDeviceModbusConfig.get", { id })
    return item
  }
}
