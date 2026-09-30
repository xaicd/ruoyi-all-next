"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesProWorkOrderBomPage() {
  return <AdminListPageTemplate title="MesProWorkOrderBom管理" endpoint="/api/admin/mes/mes-pro-work-order-bom" />
}
