"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function GoViewProjectPage() {
  return <AdminListPageTemplate title="GoViewProject管理" endpoint="/api/admin/report/go-view-project" />
}
