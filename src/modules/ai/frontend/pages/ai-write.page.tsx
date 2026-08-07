"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AiWritePage() {
  return <AdminListPageTemplate title="AiWrite管理" endpoint="/api/admin/ai/ai-write" />
}
