"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesMdClientPage() {
  return <AdminListPageTemplate title="MesMdClient管理" endpoint="/api/admin/mes/mes-md-client" />
}
