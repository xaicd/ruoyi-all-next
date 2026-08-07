"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmReturnIssueLinePage() {
  return <AdminListPageTemplate title="MesWmReturnIssueLine管理" endpoint="/api/admin/mes/mes-wm-return-issue-line" />
}
