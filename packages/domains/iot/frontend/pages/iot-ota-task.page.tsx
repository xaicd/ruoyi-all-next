"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function IotOtaTaskPage() {
  return <AdminListPageTemplate title="IotOtaTask管理" endpoint="/api/admin/iot/iot-ota-task" />
}
