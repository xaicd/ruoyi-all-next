"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function WmsCheckOrderDetailPage() {
  return <AdminListPageTemplate title="WmsCheckOrderDetail管理" endpoint="/api/admin/wms/wms-check-order-detail" />
}
