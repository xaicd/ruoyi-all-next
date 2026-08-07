"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ProductSpuPage() {
  return <AdminListPageTemplate title="ProductSpu管理" endpoint="/api/admin/mall/product-spu" />
}
