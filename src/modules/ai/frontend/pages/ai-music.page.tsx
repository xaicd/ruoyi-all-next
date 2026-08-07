"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AiMusicPage() {
  return <AdminListPageTemplate title="AiMusic管理" endpoint="/api/admin/ai/ai-music" />
}
