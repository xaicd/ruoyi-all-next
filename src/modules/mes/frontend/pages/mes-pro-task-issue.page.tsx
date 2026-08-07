"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesProTaskIssuePage() {
  return <AdminListPageTemplate title="MesProTaskIssue管理" endpoint="/api/admin/mes/mes-pro-task-issue" />
}
