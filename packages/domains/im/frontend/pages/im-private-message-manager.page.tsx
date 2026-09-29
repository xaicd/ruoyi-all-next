"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImPrivateMessageManagerPage() {
  return <AdminListPageTemplate title="ImPrivateMessageManager管理" endpoint="/api/admin/im/im-private-message-manager" />
}
