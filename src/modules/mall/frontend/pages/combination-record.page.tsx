"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CombinationRecordPage() {
  return <AdminListPageTemplate title="CombinationRecord管理" endpoint="/api/admin/mall/combination-record" />
}
