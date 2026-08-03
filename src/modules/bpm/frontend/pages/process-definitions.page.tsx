"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function BpmProcessDefinitionsModulePage() {
  return <AdminListPageTemplate title="流程定义" endpoint="/api/admin/bpm/process-definitions" />
}
