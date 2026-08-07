"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpPurchaseInPage() {
  return <AdminListPageTemplate title="ErpPurchaseIn管理" endpoint="/api/admin/erp/erp-purchase-in" />
}
