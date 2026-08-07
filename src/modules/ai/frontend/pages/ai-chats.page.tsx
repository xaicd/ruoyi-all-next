"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AiChatsModulePage() {
  return <AdminListPageTemplate title="AI对话记录" endpoint="/api/admin/ai/chats" />
}
