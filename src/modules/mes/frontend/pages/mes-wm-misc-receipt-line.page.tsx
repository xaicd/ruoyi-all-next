"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmMiscReceiptLinePage() {
  return <AdminListPageTemplate title="MesWmMiscReceiptLine管理" endpoint="/api/admin/mes/mes-wm-misc-receipt-line" />
}
