"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmStatisticsCustomerPage() {
  return <AdminListPageTemplate title="CrmStatisticsCustomer管理" endpoint="/api/admin/crm/crm-statistics-customer" />
}
