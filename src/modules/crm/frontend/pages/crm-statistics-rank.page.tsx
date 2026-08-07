"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmStatisticsRankPage() {
  return <AdminListPageTemplate title="CrmStatisticsRank管理" endpoint="/api/admin/crm/crm-statistics-rank" />
}
