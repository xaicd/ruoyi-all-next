"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesTmToolTypePage() {
  return <AdminListPageTemplate title="MesTmToolType管理" endpoint="/api/admin/mes/mes-tm-tool-type" />
}
