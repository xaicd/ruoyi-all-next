"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesQcOqcPage() {
  return <AdminListPageTemplate title="MesQcOqc管理" endpoint="/api/admin/mes/mes-qc-oqc" />
}
