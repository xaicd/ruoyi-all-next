"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SmsCallbackPage() {
  return <AdminListPageTemplate title="SmsCallback管理" endpoint="/api/admin/system/sms-callback" />
}
