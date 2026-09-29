"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmMiscIssuePage() {
  return <AdminListPageTemplate title="MesWmMiscIssue管理" endpoint="/api/admin/mes/mes-wm-misc-issue" />
}
