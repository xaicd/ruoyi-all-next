"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BargainRecordPage() {
  return <AdminListPageTemplate title="BargainRecord管理" endpoint="/api/admin/mall/bargain-record" />
}
