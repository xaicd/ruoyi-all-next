"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BargainActivityPage() {
  return <AdminListPageTemplate title="BargainActivity管理" endpoint="/api/admin/mall/bargain-activity" />
}
