"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SystemSmsLogsModulePage() {
  return <AdminListPageTemplate title="短信日志" endpoint="/api/admin/system/sms/logs" />
}
