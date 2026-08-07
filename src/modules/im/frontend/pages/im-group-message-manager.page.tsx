"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImGroupMessageManagerPage() {
  return <AdminListPageTemplate title="ImGroupMessageManager管理" endpoint="/api/admin/im/im-group-message-manager" />
}
