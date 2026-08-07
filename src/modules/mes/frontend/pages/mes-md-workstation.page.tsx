"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesMdWorkstationPage() {
  return <AdminListPageTemplate title="MesMdWorkstation管理" endpoint="/api/admin/mes/mes-md-workstation" />
}
