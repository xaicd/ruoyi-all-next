"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmCustomerPoolConfigPage() {
  return <AdminListPageTemplate title="CrmCustomerPoolConfig管理" endpoint="/api/admin/crm/crm-customer-pool-config" />
}
