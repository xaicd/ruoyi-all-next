"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function CrmCustomersModulePage() {
  return <AdminListPageTemplate title="客户管理" endpoint="/api/admin/crm/customers" />
}
