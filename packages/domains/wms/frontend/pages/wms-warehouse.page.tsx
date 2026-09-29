"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function WmsWarehousePage() {
  return <AdminListPageTemplate title="WmsWarehouse管理" endpoint="/api/admin/wms/wms-warehouse" />
}
