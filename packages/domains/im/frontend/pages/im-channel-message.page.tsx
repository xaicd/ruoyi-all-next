"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImChannelMessagePage() {
  return <AdminListPageTemplate title="ImChannelMessage管理" endpoint="/api/admin/im/im-channel-message" />
}
