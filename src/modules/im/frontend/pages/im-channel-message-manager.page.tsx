"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImChannelMessageManagerPage() {
  return <AdminListPageTemplate title="ImChannelMessageManager管理" endpoint="/api/admin/im/im-channel-message-manager" />
}
