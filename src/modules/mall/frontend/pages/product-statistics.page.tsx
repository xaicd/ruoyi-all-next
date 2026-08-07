"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ProductStatisticsPage() {
  return <AdminListPageTemplate title="ProductStatistics管理" endpoint="/api/admin/mall/product-statistics" />
}
