"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmProductIssueDetailPage() {
  return <AdminListPageTemplate title="MesWmProductIssueDetail管理" endpoint="/api/admin/mes/mes-wm-product-issue-detail" />
}
