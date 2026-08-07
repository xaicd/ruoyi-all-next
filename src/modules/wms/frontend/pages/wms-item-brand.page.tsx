"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function WmsItemBrandPage() {
  return <AdminListPageTemplate title="WmsItemBrand管理" endpoint="/api/admin/wms/wms-item-brand" />
}
