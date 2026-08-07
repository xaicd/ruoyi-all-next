"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function WmsMerchantPage() {
  return <AdminListPageTemplate title="WmsMerchant管理" endpoint="/api/admin/wms/wms-merchant" />
}
