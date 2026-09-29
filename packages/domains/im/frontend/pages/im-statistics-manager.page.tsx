"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImStatisticsManagerPage() {
  return <AdminListPageTemplate title="ImStatisticsManager管理" endpoint="/api/admin/im/im-statistics-manager" />
}
