"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmProductSalesPage() {
  return <AdminListPageTemplate title="MesWmProductSales管理" endpoint="/api/admin/mes/mes-wm-product-sales" />
}
