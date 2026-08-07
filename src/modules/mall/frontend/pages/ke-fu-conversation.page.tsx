"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function KeFuConversationPage() {
  return <AdminListPageTemplate title="KeFuConversation管理" endpoint="/api/admin/mall/ke-fu-conversation" />
}
