"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImConversationReadPage() {
  return <AdminListPageTemplate title="ImConversationRead管理" endpoint="/api/admin/im/im-conversation-read" />
}
