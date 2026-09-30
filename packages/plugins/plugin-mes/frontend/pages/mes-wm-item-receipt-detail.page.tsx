"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmItemReceiptDetailPage() {
  return <AdminListPageTemplate title="MesWmItemReceiptDetail管理" endpoint="/api/admin/mes/mes-wm-item-receipt-detail" />
}
