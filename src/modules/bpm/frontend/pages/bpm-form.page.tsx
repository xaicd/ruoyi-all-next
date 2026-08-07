"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BpmFormPage() {
  return <AdminListPageTemplate title="BpmForm管理" endpoint="/api/admin/bpm/bpm-form" />
}
