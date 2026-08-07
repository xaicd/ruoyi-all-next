"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImGroupManagerPage() {
  return <AdminListPageTemplate title="ImGroupManager管理" endpoint="/api/admin/im/im-group-manager" />
}
