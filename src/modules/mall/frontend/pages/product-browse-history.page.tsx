"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ProductBrowseHistoryPage() {
  return <AdminListPageTemplate title="ProductBrowseHistory管理" endpoint="/api/admin/mall/product-browse-history" />
}
