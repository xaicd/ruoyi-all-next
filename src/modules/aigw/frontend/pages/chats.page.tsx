"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AigwChatsPage() {
  return <AdminListPageTemplate title="对话记录" endpoint="/api/v1/admin/aigw/chats" />
}
