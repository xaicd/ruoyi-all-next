"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpPurchaseOrderPage() {
  return <AdminListPageTemplate title="ErpPurchaseOrder管理" endpoint="/api/admin/erp/erp-purchase-order" />
}
