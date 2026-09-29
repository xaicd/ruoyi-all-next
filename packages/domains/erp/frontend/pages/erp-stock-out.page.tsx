"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpStockOutPage() {
  return <AdminListPageTemplate title="ErpStockOut管理" endpoint="/api/admin/erp/erp-stock-out" />
}
