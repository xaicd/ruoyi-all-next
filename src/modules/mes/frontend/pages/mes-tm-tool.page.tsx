"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesTmToolPage() {
  return <AdminListPageTemplate title="MesTmTool管理" endpoint="/api/admin/mes/mes-tm-tool" />
}
