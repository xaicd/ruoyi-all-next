"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImGroupRequestManagerPage() {
  return <AdminListPageTemplate title="ImGroupRequestManager管理" endpoint="/api/admin/im/im-group-request-manager" />
}
