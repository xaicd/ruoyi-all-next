"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AiChatMessagePage() {
  return <AdminListPageTemplate title="AiChatMessage管理" endpoint="/api/admin/ai/ai-chat-message" />
}
