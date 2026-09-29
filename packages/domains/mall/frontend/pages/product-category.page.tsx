"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ProductCategoryPage() {
  return <AdminListPageTemplate title="ProductCategory管理" endpoint="/api/admin/mall/product-category" />
}
