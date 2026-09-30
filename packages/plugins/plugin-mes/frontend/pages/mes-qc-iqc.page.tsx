"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesQcIqcPage() {
  return <AdminListPageTemplate title="MesQcIqc管理" endpoint="/api/admin/mes/mes-qc-iqc" />
}
