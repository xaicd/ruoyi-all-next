"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmOutsourceIssuePage() {
  return <AdminListPageTemplate title="MesWmOutsourceIssue管理" endpoint="/api/admin/mes/mes-wm-outsource-issue" />
}
