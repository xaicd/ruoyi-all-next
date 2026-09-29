"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpSaleStatisticsPage() {
  return <AdminListPageTemplate title="ErpSaleStatistics管理" endpoint="/api/admin/erp/erp-sale-statistics" />
}
