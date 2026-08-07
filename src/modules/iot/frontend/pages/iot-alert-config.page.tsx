"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function IotAlertConfigPage() {
  return <AdminListPageTemplate title="IotAlertConfig管理" endpoint="/api/admin/iot/iot-alert-config" />
}
