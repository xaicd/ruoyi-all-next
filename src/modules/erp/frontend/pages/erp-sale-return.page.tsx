"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpSaleReturnPage() {
  return <AdminListPageTemplate title="ErpSaleReturn管理" endpoint="/api/admin/erp/erp-sale-return" />
}
