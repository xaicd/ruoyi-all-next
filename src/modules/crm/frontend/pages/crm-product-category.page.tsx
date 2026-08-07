"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmProductCategoryPage() {
  return <AdminListPageTemplate title="CrmProductCategory管理" endpoint="/api/admin/crm/crm-product-category" />
}
