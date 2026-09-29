"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImFaceUserItemManagerPage() {
  return <AdminListPageTemplate title="ImFaceUserItemManager管理" endpoint="/api/admin/im/im-face-user-item-manager" />
}
