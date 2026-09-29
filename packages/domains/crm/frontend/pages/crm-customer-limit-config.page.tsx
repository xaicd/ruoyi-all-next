"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmCustomerLimitConfigPage() {
  return <AdminListPageTemplate title="CrmCustomerLimitConfig管理" endpoint="/api/admin/crm/crm-customer-limit-config" />
}
