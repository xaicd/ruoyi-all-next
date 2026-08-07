"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SystemLoginLogsModulePage() {
  return <AdminListPageTemplate title="登录日志" endpoint="/api/admin/system/login-logs" />
}
