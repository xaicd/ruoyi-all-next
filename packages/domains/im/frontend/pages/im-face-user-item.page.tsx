"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImFaceUserItemPage() {
  return <AdminListPageTemplate title="ImFaceUserItem管理" endpoint="/api/admin/im/im-face-user-item" />
}
