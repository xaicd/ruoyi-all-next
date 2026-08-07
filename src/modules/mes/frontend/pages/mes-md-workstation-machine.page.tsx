"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesMdWorkstationMachinePage() {
  return <AdminListPageTemplate title="MesMdWorkstationMachine管理" endpoint="/api/admin/mes/mes-md-workstation-machine" />
}
