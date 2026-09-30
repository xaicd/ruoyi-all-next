"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function PointActivityPage() {
  return <AdminListPageTemplate title="PointActivity管理" endpoint="/api/admin/mall/point-activity" />
}
