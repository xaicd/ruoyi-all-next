"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function SystemMailLogsModulePage() {
  return <AdminListPageTemplate title="邮件日志" endpoint="/api/admin/system/mail/logs" />
}
