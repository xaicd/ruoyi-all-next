"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function WmsInventoryPage() {
  return <AdminListPageTemplate title="WmsInventory管理" endpoint="/api/admin/wms/wms-inventory" />
}
