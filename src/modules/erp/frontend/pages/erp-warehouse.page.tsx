"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpWarehousePage() {
  return <AdminListPageTemplate title="ErpWarehouse管理" endpoint="/api/admin/erp/erp-warehouse" />
}
