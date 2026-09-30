"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImPrivateMessagePage() {
  return <AdminListPageTemplate title="ImPrivateMessage管理" endpoint="/api/admin/im/im-private-message" />
}
