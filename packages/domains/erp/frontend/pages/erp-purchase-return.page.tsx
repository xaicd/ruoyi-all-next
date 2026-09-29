"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpPurchaseReturnPage() {
  return <AdminListPageTemplate title="ErpPurchaseReturn管理" endpoint="/api/admin/erp/erp-purchase-return" />
}
