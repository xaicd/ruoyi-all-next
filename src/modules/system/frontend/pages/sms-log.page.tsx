"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SmsLogPage() {
  return <AdminListPageTemplate title="SmsLog管理" endpoint="/api/admin/system/sms-log" />
}
