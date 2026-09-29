"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ProductBrandPage() {
  return <AdminListPageTemplate title="ProductBrand管理" endpoint="/api/admin/mall/product-brand" />
}
