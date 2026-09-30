import type { IotPageQueryInput, IotDeviceCreateInput, IotAlertHandleInput } from "../validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type DeviceStatus = "ONLINE" | "OFFLINE" | "FAULT"

type IotDevice = {
  id: string
  name: string
  deviceKey: string
  productId: string
  gatewayId?: string
  status: DeviceStatus
  createdAt: string
}

type AlertStatus = "PENDING" | "HANDLED" | "IGNORED"

type IotAlert = {
  id: string
  deviceId: string
  level: "INFO" | "WARN" | "ERROR" | "CRITICAL"
  message: string
  status: AlertStatus
  resolution?: string
  createdAt: string
}

const MOCK_DEVICES: IotDevice[] = [
  { id: "iot-dev-001", name: "温湿度传感器-01", deviceKey: "SENSOR-TH-001", productId: "prod-001", status: "ONLINE", createdAt: "2026-06-01T00:00:00.000Z" },
  { id: "iot-dev-002", name: "网关设备-主楼", deviceKey: "GW-MAIN-001", productId: "prod-002", status: "ONLINE", createdAt: "2026-06-15T00:00:00.000Z" },
  { id: "iot-dev-003", name: "电量计-仓库", deviceKey: "ELEC-WH-001", productId: "prod-003", status: "OFFLINE", createdAt: "2026-07-01T00:00:00.000Z" },
]

const MOCK_ALERTS: IotAlert[] = [
  { id: "iot-alert-001", deviceId: "iot-dev-003", level: "WARN", message: "设备离线超过1小时", status: "PENDING", createdAt: "2026-08-01T08:00:00.000Z" },
  { id: "iot-alert-002", deviceId: "iot-dev-001", level: "INFO", message: "温度超过阈值35°C", status: "HANDLED", resolution: "已通知运维", createdAt: "2026-08-02T14:00:00.000Z" },
]

export class IotService {
  static async listDevices(input: IotPageQueryInput) {
    domainLog.event("iot.device.list", {
      page: input.page,
      pageSize: input.pageSize,
      status: input.status,
      hasKeyword: Boolean(input.keyword),
    })

    let filtered = [...MOCK_DEVICES]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter(
        (d) => d.name.toLowerCase().includes(kw) || d.deviceKey.toLowerCase().includes(kw),
      )
    }
    if (input.status) {
      filtered = filtered.filter((d) => d.status === input.status)
    }

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async createDevice(input: IotDeviceCreateInput) {
    const exists = MOCK_DEVICES.find((d) => d.deviceKey === input.deviceKey)
    if (exists) throw new Error("设备Key已存在")

    const id = `iot-dev-${Date.now()}`
    const device: IotDevice = {
      id,
      name: input.name,
      deviceKey: input.deviceKey,
      productId: input.productId,
      gatewayId: input.gatewayId,
      status: "OFFLINE",
      createdAt: new Date().toISOString(),
    }
    MOCK_DEVICES.push(device)

    domainLog.event("iot.device.create", { deviceId: id, deviceKey: input.deviceKey })
    domainLog.audit("iot.device.create", {
      targetType: "IOT_DEVICE",
      targetId: id,
      name: input.name,
      deviceKey: input.deviceKey,
    })

    return device
  }

  static async listAlerts(input: IotPageQueryInput) {
    domainLog.event("iot.alert.list", { page: input.page, pageSize: input.pageSize })

    let filtered = [...MOCK_ALERTS]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((a) => a.message.toLowerCase().includes(kw))
    }

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async handleAlert(input: IotAlertHandleInput) {
    const alert = MOCK_ALERTS.find((a) => a.id === input.alertId)
    if (!alert) throw new Error("告警记录不存在")
    if (alert.status === "HANDLED") throw new Error("告警已处理，不可重复操作")

    alert.status = "HANDLED"
    alert.resolution = input.resolution

    domainLog.event("iot.alert.handle", { alertId: input.alertId })
    domainLog.audit("iot.alert.handle", {
      targetType: "IOT_ALERT",
      targetId: input.alertId,
      resolution: input.resolution,
    })

    return { alertId: alert.id, status: alert.status, resolution: alert.resolution }
  }
}
