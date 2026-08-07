"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CombinationActivityPage() {
  return <AdminListPageTemplate title="CombinationActivity管理" endpoint="/api/admin/mall/combination-activity" />
}
