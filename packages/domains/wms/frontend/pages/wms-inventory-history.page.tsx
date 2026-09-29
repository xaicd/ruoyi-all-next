"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function WmsInventoryHistoryPage() {
  return <AdminListPageTemplate title="WmsInventoryHistory管理" endpoint="/api/admin/wms/wms-inventory-history" />
}
