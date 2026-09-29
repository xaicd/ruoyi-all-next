"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MpAccountPage() {
  return <AdminListPageTemplate title="MpAccount管理" endpoint="/api/admin/mp/mp-account" />
}
