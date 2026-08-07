"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SmsTemplatePage() {
  return <AdminListPageTemplate title="SmsTemplate管理" endpoint="/api/admin/system/sms-template" />
}
