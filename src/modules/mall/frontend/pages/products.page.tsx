"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function MallProductsModulePage() {
  return <AdminListPageTemplate title="商城商品" endpoint="/api/admin/mall/products" />
}
