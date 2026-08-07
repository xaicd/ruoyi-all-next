"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AiKnowledgeSegmentPage() {
  return <AdminListPageTemplate title="AiKnowledgeSegment管理" endpoint="/api/admin/ai/ai-knowledge-segment" />
}
