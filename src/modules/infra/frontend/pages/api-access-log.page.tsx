"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ApiAccessLogPage() {
  return <AdminListPageTemplate title="ApiAccessLog管理" endpoint="/api/admin/infra/api-access-log" />
}
