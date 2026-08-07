"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpProductPage() {
  return <AdminListPageTemplate title="ErpProduct管理" endpoint="/api/admin/erp/erp-product" />
}
