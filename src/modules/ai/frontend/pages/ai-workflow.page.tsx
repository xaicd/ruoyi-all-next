"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AiWorkflowPage() {
  return <AdminListPageTemplate title="AiWorkflow管理" endpoint="/api/admin/ai/ai-workflow" />
}
