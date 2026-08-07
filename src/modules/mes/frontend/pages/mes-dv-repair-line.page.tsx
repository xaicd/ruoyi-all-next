"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesDvRepairLinePage() {
  return <AdminListPageTemplate title="MesDvRepairLine管理" endpoint="/api/admin/mes/mes-dv-repair-line" />
}
