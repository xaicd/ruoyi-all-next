"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function WmsReceiptOrderPage() {
  return <AdminListPageTemplate title="WmsReceiptOrder管理" endpoint="/api/admin/wms/wms-receipt-order" />
}
