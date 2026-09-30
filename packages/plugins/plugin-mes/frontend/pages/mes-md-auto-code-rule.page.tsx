"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesMdAutoCodeRulePage() {
  return <AdminListPageTemplate title="MesMdAutoCodeRule管理" endpoint="/api/admin/mes/mes-md-auto-code-rule" />
}
