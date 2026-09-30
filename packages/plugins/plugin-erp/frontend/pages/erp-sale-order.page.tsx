"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpSaleOrderPage() {
  return <AdminListPageTemplate title="ErpSaleOrder管理" endpoint="/api/admin/erp/erp-sale-order" />
}
