"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MpTagPage() {
  return <AdminListPageTemplate title="MpTag管理" endpoint="/api/admin/mp/mp-tag" />
}
