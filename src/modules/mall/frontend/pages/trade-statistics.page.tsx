"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function TradeStatisticsPage() {
  return <AdminListPageTemplate title="TradeStatistics管理" endpoint="/api/admin/mall/trade-statistics" />
}
