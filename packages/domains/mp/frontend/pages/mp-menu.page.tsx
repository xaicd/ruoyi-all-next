"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MpMenuPage() {
  return <AdminListPageTemplate title="MpMenu管理" endpoint="/api/admin/mp/mp-menu" />
}
