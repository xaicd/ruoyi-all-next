"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function SystemSmsChannelsModulePage() {
  return <AdminListPageTemplate title="短信渠道" endpoint="/api/admin/system/sms/channels" />
}
