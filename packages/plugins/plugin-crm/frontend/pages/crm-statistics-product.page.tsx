"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmStatisticsProductPage() {
  return <AdminListPageTemplate title="CrmStatisticsProduct管理" endpoint="/api/admin/crm/crm-statistics-product" />
}
