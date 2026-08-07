"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ProductPropertyPage() {
  return <AdminListPageTemplate title="ProductProperty管理" endpoint="/api/admin/mall/product-property" />
}
