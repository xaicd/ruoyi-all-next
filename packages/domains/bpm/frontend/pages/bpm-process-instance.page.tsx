"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BpmProcessInstancePage() {
  return <AdminListPageTemplate title="BpmProcessInstance管理" endpoint="/api/admin/bpm/bpm-process-instance" />
}
