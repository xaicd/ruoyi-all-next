"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesDvMachineryPage() {
  return <AdminListPageTemplate title="MesDvMachinery管理" endpoint="/api/admin/mes/mes-dv-machinery" />
}
