"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function InfraApiLogsModulePage() {
  return <AdminListPageTemplate title="API日志" endpoint="/api/admin/infra/api-logs" />
}
