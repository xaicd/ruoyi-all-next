"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AiModelPage() {
  return <AdminListPageTemplate title="AiModel管理" endpoint="/api/admin/ai/ai-model" />
}
