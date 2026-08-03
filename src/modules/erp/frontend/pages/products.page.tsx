"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function ErpProductsModulePage() {
  return <AdminListPageTemplate title="ERP商品" endpoint="/api/admin/erp/products" />
}
