"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function IotDevicesModulePage() {
  return <AdminListPageTemplate title="IoT设备管理" endpoint="/api/admin/iot/devices" />
}
