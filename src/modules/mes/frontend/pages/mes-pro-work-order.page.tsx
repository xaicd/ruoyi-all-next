"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesProWorkOrderPage() {
  return <AdminListPageTemplate title="MesProWorkOrder管理" endpoint="/api/admin/mes/mes-pro-work-order" />
}
