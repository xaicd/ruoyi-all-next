"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesQcDefectRecordPage() {
  return <AdminListPageTemplate title="MesQcDefectRecord管理" endpoint="/api/admin/mes/mes-qc-defect-record" />
}
