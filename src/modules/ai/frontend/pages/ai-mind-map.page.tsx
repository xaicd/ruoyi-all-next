"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AiMindMapPage() {
  return <AdminListPageTemplate title="AiMindMap管理" endpoint="/api/admin/ai/ai-mind-map" />
}
