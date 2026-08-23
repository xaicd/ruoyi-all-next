"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AigwTokensPage() {
  return <AdminListPageTemplate title="调用令牌" endpoint="/api/v1/admin/aigw/tokens" />
}
