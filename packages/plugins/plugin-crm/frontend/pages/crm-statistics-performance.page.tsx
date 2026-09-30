"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmStatisticsPerformancePage() {
  return <AdminListPageTemplate title="CrmStatisticsPerformance管理" endpoint="/api/admin/crm/crm-statistics-performance" />
}
