"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function IotAlertsModulePage() {
  return <AdminListPageTemplate title="IoT告警管理" endpoint="/api/admin/iot/alerts" />
}
