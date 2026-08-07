"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function WmsShipmentOrderPage() {
  return <AdminListPageTemplate title="WmsShipmentOrder管理" endpoint="/api/admin/wms/wms-shipment-order" />
}
