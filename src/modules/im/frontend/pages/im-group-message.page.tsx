"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImGroupMessagePage() {
  return <AdminListPageTemplate title="ImGroupMessage管理" endpoint="/api/admin/im/im-group-message" />
}
