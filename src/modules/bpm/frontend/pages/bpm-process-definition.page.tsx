"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BpmProcessDefinitionPage() {
  return <AdminListPageTemplate title="BpmProcessDefinition管理" endpoint="/api/admin/bpm/bpm-process-definition" />
}
