"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImGroupRequestPage() {
  return <AdminListPageTemplate title="ImGroupRequest管理" endpoint="/api/admin/im/im-group-request" />
}
