"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImSensitiveWordManagerPage() {
  return <AdminListPageTemplate title="ImSensitiveWordManager管理" endpoint="/api/admin/im/im-sensitive-word-manager" />
}
