"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpStockCheckPage() {
  return <AdminListPageTemplate title="ErpStockCheck管理" endpoint="/api/admin/erp/erp-stock-check" />
}
