"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesProTaskPage() {
  return <AdminListPageTemplate title="MesProTask管理" endpoint="/api/admin/mes/mes-pro-task" />
}
