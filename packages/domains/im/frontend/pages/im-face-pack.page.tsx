"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImFacePackPage() {
  return <AdminListPageTemplate title="ImFacePack管理" endpoint="/api/admin/im/im-face-pack" />
}
