"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function WmsItemCategoryPage() {
  return <AdminListPageTemplate title="WmsItemCategory管理" endpoint="/api/admin/wms/wms-item-category" />
}
