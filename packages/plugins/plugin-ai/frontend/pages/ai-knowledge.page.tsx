"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AiKnowledgePage() {
  return <AdminListPageTemplate title="AiKnowledge管理" endpoint="/api/admin/ai/ai-knowledge" />
}
