"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpSaleOutPage() {
  return <AdminListPageTemplate title="ErpSaleOut管理" endpoint="/api/admin/erp/erp-sale-out" />
}
