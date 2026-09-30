"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AiApiKeyPage() {
  return <AdminListPageTemplate title="AiApiKey管理" endpoint="/api/admin/ai/ai-api-key" />
}
