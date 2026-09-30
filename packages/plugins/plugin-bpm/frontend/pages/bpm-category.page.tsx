"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BpmCategoryPage() {
  return <AdminListPageTemplate title="BpmCategory管理" endpoint="/api/admin/bpm/bpm-category" />
}
