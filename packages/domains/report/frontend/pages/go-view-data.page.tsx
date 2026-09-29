"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function GoViewDataPage() {
  return <AdminListPageTemplate title="GoViewData管理" endpoint="/api/admin/report/go-view-data" />
}
