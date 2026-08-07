"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesDvCheckPlanMachineryPage() {
  return <AdminListPageTemplate title="MesDvCheckPlanMachinery管理" endpoint="/api/admin/mes/mes-dv-check-plan-machinery" />
}
