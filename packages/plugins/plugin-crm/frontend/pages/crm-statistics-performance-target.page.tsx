"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmStatisticsPerformanceTargetPage() {
  return <AdminListPageTemplate title="CrmStatisticsPerformanceTarget管理" endpoint="/api/admin/crm/crm-statistics-performance-target" />
}
