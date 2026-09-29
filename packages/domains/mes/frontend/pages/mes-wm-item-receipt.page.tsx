"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmItemReceiptPage() {
  return <AdminListPageTemplate title="MesWmItemReceipt管理" endpoint="/api/admin/mes/mes-wm-item-receipt" />
}
