"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmMiscReceiptPage() {
  return <AdminListPageTemplate title="MesWmMiscReceipt管理" endpoint="/api/admin/mes/mes-wm-misc-receipt" />
}
