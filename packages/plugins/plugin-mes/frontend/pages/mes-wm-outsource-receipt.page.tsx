"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmOutsourceReceiptPage() {
  return <AdminListPageTemplate title="MesWmOutsourceReceipt管理" endpoint="/api/admin/mes/mes-wm-outsource-receipt" />
}
