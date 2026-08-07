"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpStockMovePage() {
  return <AdminListPageTemplate title="ErpStockMove管理" endpoint="/api/admin/erp/erp-stock-move" />
}
