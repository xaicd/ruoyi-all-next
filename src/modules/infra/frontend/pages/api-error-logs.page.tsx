"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function InfraApiErrorLogsModulePage() {
  return <AdminListPageTemplate title="错误日志" endpoint="/api/admin/infra/api-error-logs" />
}
