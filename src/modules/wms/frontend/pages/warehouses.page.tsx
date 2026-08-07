"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function WmsWarehousesModulePage() {
  return <AdminListPageTemplate title="WMS仓库" endpoint="/api/admin/wms/warehouses" />
}
