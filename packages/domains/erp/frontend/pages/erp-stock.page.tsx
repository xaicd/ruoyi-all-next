"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpStockPage() {
  return <AdminListPageTemplate title="ErpStock管理" endpoint="/api/admin/erp/erp-stock" />
}
