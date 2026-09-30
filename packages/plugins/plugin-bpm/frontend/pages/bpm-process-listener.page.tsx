"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BpmProcessListenerPage() {
  return <AdminListPageTemplate title="BpmProcessListener管理" endpoint="/api/admin/bpm/bpm-process-listener" />
}
