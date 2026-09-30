"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesMdItemPage() {
  return <AdminListPageTemplate title="MesMdItem管理" endpoint="/api/admin/mes/mes-md-item" />
}
