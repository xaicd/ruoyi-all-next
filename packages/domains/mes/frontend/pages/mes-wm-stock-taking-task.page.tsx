"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmStockTakingTaskPage() {
  return <AdminListPageTemplate title="MesWmStockTakingTask管理" endpoint="/api/admin/mes/mes-wm-stock-taking-task" />
}
