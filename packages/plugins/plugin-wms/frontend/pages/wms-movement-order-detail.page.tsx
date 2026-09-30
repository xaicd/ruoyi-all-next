"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function WmsMovementOrderDetailPage() {
  return <AdminListPageTemplate title="WmsMovementOrderDetail管理" endpoint="/api/admin/wms/wms-movement-order-detail" />
}
