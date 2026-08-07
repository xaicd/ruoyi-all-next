"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function PayStatisticsPage() {
  return <AdminListPageTemplate title="PayStatistics管理" endpoint="/api/admin/mall/pay-statistics" />
}
