"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function IotProductCategoryPage() {
  return <AdminListPageTemplate title="IotProductCategory管理" endpoint="/api/admin/iot/iot-product-category" />
}
