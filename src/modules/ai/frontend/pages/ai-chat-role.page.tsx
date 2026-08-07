"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AiChatRolePage() {
  return <AdminListPageTemplate title="AiChatRole管理" endpoint="/api/admin/ai/ai-chat-role" />
}
