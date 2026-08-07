"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmCustomerPage() {
  return <AdminListPageTemplate title="CrmCustomer管理" endpoint="/api/admin/crm/crm-customer" />
}
