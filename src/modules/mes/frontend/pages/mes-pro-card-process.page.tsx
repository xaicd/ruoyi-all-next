"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesProCardProcessPage() {
  return <AdminListPageTemplate title="MesProCardProcess管理" endpoint="/api/admin/mes/mes-pro-card-process" />
}
