"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmOutsourceIssueDetailPage() {
  return <AdminListPageTemplate title="MesWmOutsourceIssueDetail管理" endpoint="/api/admin/mes/mes-wm-outsource-issue-detail" />
}
