"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmItemReceiptLinePage() {
  return <AdminListPageTemplate title="MesWmItemReceiptLine管理" endpoint="/api/admin/mes/mes-wm-item-receipt-line" />
}
