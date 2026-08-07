"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmProductReceiptLinePage() {
  return <AdminListPageTemplate title="MesWmProductReceiptLine管理" endpoint="/api/admin/mes/mes-wm-product-receipt-line" />
}
