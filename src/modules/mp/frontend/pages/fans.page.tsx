"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function MpFansModulePage() {
  return <AdminListPageTemplate title="粉丝管理" endpoint="/api/admin/mp/fans" />
}
