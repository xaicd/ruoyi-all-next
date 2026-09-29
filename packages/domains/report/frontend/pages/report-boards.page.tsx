"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ReportBoardsModulePage() {
  return <AdminListPageTemplate title="数据大屏" endpoint="/api/admin/report/boards" />
}
