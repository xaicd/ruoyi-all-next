"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesQcOqcLinePage() {
  return <AdminListPageTemplate title="MesQcOqcLine管理" endpoint="/api/admin/mes/mes-qc-oqc-line" />
}
