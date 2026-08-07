"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MpStatisticsPage() {
  return <AdminListPageTemplate title="MpStatistics管理" endpoint="/api/admin/mp/mp-statistics" />
}
