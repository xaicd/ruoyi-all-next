"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmReturnIssuePage() {
  return <AdminListPageTemplate title="MesWmReturnIssue管理" endpoint="/api/admin/mes/mes-wm-return-issue" />
}
