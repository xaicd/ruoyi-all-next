"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function SystemOperateLogsModulePage() {
  return <AdminListPageTemplate title="操作日志" endpoint="/api/admin/system/operate-logs" />
}
