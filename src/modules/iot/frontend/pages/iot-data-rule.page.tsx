"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function IotDataRulePage() {
  return <AdminListPageTemplate title="IotDataRule管理" endpoint="/api/admin/iot/iot-data-rule" />
}
