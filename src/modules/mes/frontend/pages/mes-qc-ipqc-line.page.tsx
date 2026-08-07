"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesQcIpqcLinePage() {
  return <AdminListPageTemplate title="MesQcIpqcLine管理" endpoint="/api/admin/mes/mes-qc-ipqc-line" />
}
