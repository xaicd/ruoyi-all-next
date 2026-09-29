"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BpmModelPage() {
  return <AdminListPageTemplate title="BpmModel管理" endpoint="/api/admin/bpm/bpm-model" />
}
