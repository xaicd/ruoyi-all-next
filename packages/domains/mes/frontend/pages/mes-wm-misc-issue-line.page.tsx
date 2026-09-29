"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmMiscIssueLinePage() {
  return <AdminListPageTemplate title="MesWmMiscIssueLine管理" endpoint="/api/admin/mes/mes-wm-misc-issue-line" />
}
