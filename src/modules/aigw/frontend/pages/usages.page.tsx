"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AigwUsagesPage() {
  return <AdminListPageTemplate title="用量日志" endpoint="/api/v1/admin/aigw/usages" />
}
