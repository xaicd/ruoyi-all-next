"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImGroupPage() {
  return <AdminListPageTemplate title="ImGroup管理" endpoint="/api/admin/im/im-group" />
}
