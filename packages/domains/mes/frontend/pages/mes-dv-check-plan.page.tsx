"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesDvCheckPlanPage() {
  return <AdminListPageTemplate title="MesDvCheckPlan管理" endpoint="/api/admin/mes/mes-dv-check-plan" />
}
