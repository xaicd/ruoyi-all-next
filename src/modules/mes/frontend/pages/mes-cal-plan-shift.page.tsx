"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesCalPlanShiftPage() {
  return <AdminListPageTemplate title="MesCalPlanShift管理" endpoint="/api/admin/mes/mes-cal-plan-shift" />
}
