"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AiChatConversationPage() {
  return <AdminListPageTemplate title="AiChatConversation管理" endpoint="/api/admin/ai/ai-chat-conversation" />
}
