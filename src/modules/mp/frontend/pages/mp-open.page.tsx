"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MpOpenPage() {
  return <AdminListPageTemplate title="MpOpen管理" endpoint="/api/admin/mp/mp-open" />
}
