"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function IotAlertRecordPage() {
  return <AdminListPageTemplate title="IotAlertRecord管理" endpoint="/api/admin/iot/iot-alert-record" />
}
