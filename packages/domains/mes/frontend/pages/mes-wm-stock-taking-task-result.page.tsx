"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmStockTakingTaskResultPage() {
  return <AdminListPageTemplate title="MesWmStockTakingTaskResult管理" endpoint="/api/admin/mes/mes-wm-stock-taking-task-result" />
}
