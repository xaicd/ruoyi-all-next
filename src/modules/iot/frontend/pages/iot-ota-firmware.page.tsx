"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function IotOtaFirmwarePage() {
  return <AdminListPageTemplate title="IotOtaFirmware管理" endpoint="/api/admin/iot/iot-ota-firmware" />
}
