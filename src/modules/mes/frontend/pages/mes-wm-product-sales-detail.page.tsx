"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmProductSalesDetailPage() {
  return <AdminListPageTemplate title="MesWmProductSalesDetail管理" endpoint="/api/admin/mes/mes-wm-product-sales-detail" />
}
