"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MpMessagePage() {
  return <AdminListPageTemplate title="MpMessage管理" endpoint="/api/admin/mp/mp-message" />
}
