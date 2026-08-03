"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function BpmTasksModulePage() {
  return <AdminListPageTemplate title="待办任务" endpoint="/api/admin/bpm/tasks" />
}
