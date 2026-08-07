"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function WmsMovementOrderPage() {
  return <AdminListPageTemplate title="WmsMovementOrder管理" endpoint="/api/admin/wms/wms-movement-order" />
}
