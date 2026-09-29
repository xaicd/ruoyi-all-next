"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function IotDeviceModbusPointPage() {
  return <AdminListPageTemplate title="IotDeviceModbusPoint管理" endpoint="/api/admin/iot/iot-device-modbus-point" />
}
