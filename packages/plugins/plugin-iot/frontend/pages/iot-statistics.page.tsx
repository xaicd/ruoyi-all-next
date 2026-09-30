"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function IotStatisticsPage() {
  return <AdminListPageTemplate title="IotStatistics管理" endpoint="/api/admin/iot/iot-statistics" />
}
