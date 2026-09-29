"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpStockRecordPage() {
  return <AdminListPageTemplate title="ErpStockRecord管理" endpoint="/api/admin/erp/erp-stock-record" />
}
