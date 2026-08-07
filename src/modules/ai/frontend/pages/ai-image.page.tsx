"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AiImagePage() {
  return <AdminListPageTemplate title="AiImage管理" endpoint="/api/admin/ai/ai-image" />
}
