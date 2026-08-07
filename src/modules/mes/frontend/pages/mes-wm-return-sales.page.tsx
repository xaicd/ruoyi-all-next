"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmReturnSalesPage() {
  return <AdminListPageTemplate title="MesWmReturnSales管理" endpoint="/api/admin/mes/mes-wm-return-sales" />
}
