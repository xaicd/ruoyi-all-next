import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type IotOtaFirmwareItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type IotOtaFirmwareCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotOtaFirmwareUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotOtaFirmwarePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: IotOtaFirmwareItem[] = [
  { id: "iot-ota-firmware-001", name: "IotOtaFirmware 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "iot-ota-firmware-002", name: "IotOtaFirmware 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class IotOtaFirmwareService {
  /** 分页查询 */
  static async page(input: IotOtaFirmwarePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("iot.iotOtaFirmware.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("IotOtaFirmware不存在")
    domainLog.event("iot.iotOtaFirmware.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: IotOtaFirmwareCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `iot-ota-firmware-${++nextId}`
    const item: IotOtaFirmwareItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("iot.iotOtaFirmware.create", { id })
    domainLog.audit("iot.iotOtaFirmware.create", { targetType: "IOT_IOTOTAFIRMWARE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: IotOtaFirmwareUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("IotOtaFirmware不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("iot.iotOtaFirmware.update", { id: input.id })
    domainLog.audit("iot.iotOtaFirmware.update", { targetType: "IOT_IOTOTAFIRMWARE", targetId: input.id })
    return true
  }
}
