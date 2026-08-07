"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesQcDefectPage() {
  return <AdminListPageTemplate title="MesQcDefect管理" endpoint="/api/admin/mes/mes-qc-defect" />
}
