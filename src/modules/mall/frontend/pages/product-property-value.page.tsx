"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ProductPropertyValuePage() {
  return <AdminListPageTemplate title="ProductPropertyValue管理" endpoint="/api/admin/mall/product-property-value" />
}
