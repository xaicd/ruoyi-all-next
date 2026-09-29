"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpProductUnitPage() {
  return <AdminListPageTemplate title="ErpProductUnit管理" endpoint="/api/admin/erp/erp-product-unit" />
}
