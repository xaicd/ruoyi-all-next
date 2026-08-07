"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpCustomerPage() {
  return <AdminListPageTemplate title="ErpCustomer管理" endpoint="/api/admin/erp/erp-customer" />
}
