"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesDvRepairPage() {
  return <AdminListPageTemplate title="MesDvRepair管理" endpoint="/api/admin/mes/mes-dv-repair" />
}
