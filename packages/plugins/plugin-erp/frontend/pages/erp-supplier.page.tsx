"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpSupplierPage() {
  return <AdminListPageTemplate title="ErpSupplier管理" endpoint="/api/admin/erp/erp-supplier" />
}
