"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWorkOrdersModulePage() {
  return <AdminListPageTemplate title="MES工单" endpoint="/api/admin/mes/work-orders" />
}
