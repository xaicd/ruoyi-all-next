"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function IotDeviceGroupPage() {
  return <AdminListPageTemplate title="IotDeviceGroup管理" endpoint="/api/admin/iot/iot-device-group" />
}
