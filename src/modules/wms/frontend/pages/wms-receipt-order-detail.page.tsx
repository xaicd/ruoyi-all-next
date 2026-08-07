"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function WmsReceiptOrderDetailPage() {
  return <AdminListPageTemplate title="WmsReceiptOrderDetail管理" endpoint="/api/admin/wms/wms-receipt-order-detail" />
}
