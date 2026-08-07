"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesQcTemplateItemPage() {
  return <AdminListPageTemplate title="MesQcTemplateItem管理" endpoint="/api/admin/mes/mes-qc-template-item" />
}
