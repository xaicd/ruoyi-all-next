"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function WmsCheckOrderPage() {
  return <AdminListPageTemplate title="WmsCheckOrder管理" endpoint="/api/admin/wms/wms-check-order" />
}
