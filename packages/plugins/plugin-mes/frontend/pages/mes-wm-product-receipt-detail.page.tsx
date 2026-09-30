"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmProductReceiptDetailPage() {
  return <AdminListPageTemplate title="MesWmProductReceiptDetail管理" endpoint="/api/admin/mes/mes-wm-product-receipt-detail" />
}
