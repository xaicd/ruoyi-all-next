"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesHomeStatisticsPage() {
  return <AdminListPageTemplate title="MesHomeStatistics管理" endpoint="/api/admin/mes/mes-home-statistics" />
}
