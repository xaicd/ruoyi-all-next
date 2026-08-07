"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function InfraJobLogsModulePage() {
  return <AdminListPageTemplate title="任务日志" endpoint="/api/admin/infra/job-logs" />
}
