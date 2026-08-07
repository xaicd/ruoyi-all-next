"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImConversationsModulePage() {
  return <AdminListPageTemplate title="IM会话" endpoint="/api/admin/im/conversations" />
}
