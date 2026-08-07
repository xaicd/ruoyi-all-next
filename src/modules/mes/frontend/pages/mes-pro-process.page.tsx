"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesProProcessPage() {
  return <AdminListPageTemplate title="MesProProcess管理" endpoint="/api/admin/mes/mes-pro-process" />
}
