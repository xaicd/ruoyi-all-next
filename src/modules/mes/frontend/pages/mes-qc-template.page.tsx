"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesQcTemplatePage() {
  return <AdminListPageTemplate title="MesQcTemplate管理" endpoint="/api/admin/mes/mes-qc-template" />
}
