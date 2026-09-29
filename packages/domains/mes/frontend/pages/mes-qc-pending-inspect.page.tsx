"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesQcPendingInspectPage() {
  return <AdminListPageTemplate title="MesQcPendingInspect管理" endpoint="/api/admin/mes/mes-qc-pending-inspect" />
}
