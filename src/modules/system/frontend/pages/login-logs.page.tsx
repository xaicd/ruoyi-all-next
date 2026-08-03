"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function SystemLoginLogsModulePage() {
  return <AdminListPageTemplate title="登录日志" endpoint="/api/admin/system/login-logs" />
}
