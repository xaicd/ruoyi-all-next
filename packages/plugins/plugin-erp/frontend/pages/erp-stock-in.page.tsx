"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpStockInPage() {
  return <AdminListPageTemplate title="ErpStockIn管理" endpoint="/api/admin/erp/erp-stock-in" />
}
