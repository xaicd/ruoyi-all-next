"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmOutsourceIssueLinePage() {
  return <AdminListPageTemplate title="MesWmOutsourceIssueLine管理" endpoint="/api/admin/mes/mes-wm-outsource-issue-line" />
}
