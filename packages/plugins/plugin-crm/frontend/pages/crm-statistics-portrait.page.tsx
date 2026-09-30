"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmStatisticsPortraitPage() {
  return <AdminListPageTemplate title="CrmStatisticsPortrait管理" endpoint="/api/admin/crm/crm-statistics-portrait" />
}
