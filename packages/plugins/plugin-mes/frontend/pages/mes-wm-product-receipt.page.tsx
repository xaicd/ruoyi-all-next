"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmProductReceiptPage() {
  return <AdminListPageTemplate title="MesWmProductReceipt管理" endpoint="/api/admin/mes/mes-wm-product-receipt" />
}
