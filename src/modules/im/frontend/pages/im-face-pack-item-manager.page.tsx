"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImFacePackItemManagerPage() {
  return <AdminListPageTemplate title="ImFacePackItemManager管理" endpoint="/api/admin/im/im-face-pack-item-manager" />
}
