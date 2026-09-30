"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MpMaterialPage() {
  return <AdminListPageTemplate title="MpMaterial管理" endpoint="/api/admin/mp/mp-material" />
}
