"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmStockTakingTaskLinePage() {
  return <AdminListPageTemplate title="MesWmStockTakingTaskLine管理" endpoint="/api/admin/mes/mes-wm-stock-taking-task-line" />
}
