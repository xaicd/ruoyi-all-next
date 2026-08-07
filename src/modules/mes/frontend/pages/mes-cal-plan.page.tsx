"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesCalPlanPage() {
  return <AdminListPageTemplate title="MesCalPlan管理" endpoint="/api/admin/mes/mes-cal-plan" />
}
