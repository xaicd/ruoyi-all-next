"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AiKnowledgeDocumentPage() {
  return <AdminListPageTemplate title="AiKnowledgeDocument管理" endpoint="/api/admin/ai/ai-knowledge-document" />
}
