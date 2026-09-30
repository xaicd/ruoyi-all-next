"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function WmsShipmentOrderDetailPage() {
  return <AdminListPageTemplate title="WmsShipmentOrderDetail管理" endpoint="/api/admin/wms/wms-shipment-order-detail" />
}
