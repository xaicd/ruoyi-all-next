"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpProductCategoryPage() {
  return <AdminListPageTemplate title="ErpProductCategory管理" endpoint="/api/admin/erp/erp-product-category" />
}
