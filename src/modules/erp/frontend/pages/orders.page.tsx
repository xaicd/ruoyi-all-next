"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function ErpOrdersModulePage() {
  return <AdminListPageTemplate title="ERP订单" endpoint="/api/admin/erp/orders" />
}
