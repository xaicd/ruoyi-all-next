"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BpmTaskPage() {
  return <AdminListPageTemplate title="BpmTask管理" endpoint="/api/admin/bpm/bpm-task" />
}
