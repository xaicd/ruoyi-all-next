"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesProProcessContentPage() {
  return <AdminListPageTemplate title="MesProProcessContent管理" endpoint="/api/admin/mes/mes-pro-process-content" />
}
