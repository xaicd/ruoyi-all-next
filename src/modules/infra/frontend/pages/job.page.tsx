"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function JobPage() {
  return <AdminListPageTemplate title="Job管理" endpoint="/api/admin/infra/job" />
}
