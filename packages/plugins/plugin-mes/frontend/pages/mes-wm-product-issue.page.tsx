"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmProductIssuePage() {
  return <AdminListPageTemplate title="MesWmProductIssue管理" endpoint="/api/admin/mes/mes-wm-product-issue" />
}
