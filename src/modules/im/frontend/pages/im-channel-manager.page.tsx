"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImChannelManagerPage() {
  return <AdminListPageTemplate title="ImChannelManager管理" endpoint="/api/admin/im/im-channel-manager" />
}
