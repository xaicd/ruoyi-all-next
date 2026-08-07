"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmProductSalesLinePage() {
  return <AdminListPageTemplate title="MesWmProductSalesLine管理" endpoint="/api/admin/mes/mes-wm-product-sales-line" />
}
