"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MemberStatisticsPage() {
  return <AdminListPageTemplate title="MemberStatistics管理" endpoint="/api/admin/mall/member-statistics" />
}
