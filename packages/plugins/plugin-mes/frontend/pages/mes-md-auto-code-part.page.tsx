"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesMdAutoCodePartPage() {
  return <AdminListPageTemplate title="MesMdAutoCodePart管理" endpoint="/api/admin/mes/mes-md-auto-code-part" />
}
