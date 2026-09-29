"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesQcIndicatorPage() {
  return <AdminListPageTemplate title="MesQcIndicator管理" endpoint="/api/admin/mes/mes-qc-indicator" />
}
