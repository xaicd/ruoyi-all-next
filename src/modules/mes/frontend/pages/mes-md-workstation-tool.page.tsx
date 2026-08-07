"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesMdWorkstationToolPage() {
  return <AdminListPageTemplate title="MesMdWorkstationTool管理" endpoint="/api/admin/mes/mes-md-workstation-tool" />
}
