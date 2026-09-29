"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function WmsItemSkuPage() {
  return <AdminListPageTemplate title="WmsItemSku管理" endpoint="/api/admin/wms/wms-item-sku" />
}
