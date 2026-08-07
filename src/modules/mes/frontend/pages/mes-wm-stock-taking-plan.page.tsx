"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmStockTakingPlanPage() {
  return <AdminListPageTemplate title="MesWmStockTakingPlan管理" endpoint="/api/admin/mes/mes-wm-stock-taking-plan" />
}
