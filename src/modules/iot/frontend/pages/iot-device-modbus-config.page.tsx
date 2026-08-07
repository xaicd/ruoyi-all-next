"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function IotDeviceModbusConfigPage() {
  return <AdminListPageTemplate title="IotDeviceModbusConfig管理" endpoint="/api/admin/iot/iot-device-modbus-config" />
}
