"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesQcRqcPage() {
  return <AdminListPageTemplate title="MesQcRqc管理" endpoint="/api/admin/mes/mes-qc-rqc" />
}
