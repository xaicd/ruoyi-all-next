"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImFacePackManagerPage() {
  return <AdminListPageTemplate title="ImFacePackManager管理" endpoint="/api/admin/im/im-face-pack-manager" />
}
