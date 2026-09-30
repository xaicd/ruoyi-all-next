"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesQcRqcLinePage() {
  return <AdminListPageTemplate title="MesQcRqcLine管理" endpoint="/api/admin/mes/mes-qc-rqc-line" />
}
