"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesQcIqcLinePage() {
  return <AdminListPageTemplate title="MesQcIqcLine管理" endpoint="/api/admin/mes/mes-qc-iqc-line" />
}
