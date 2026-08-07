"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MailLogPage() {
  return <AdminListPageTemplate title="MailLog管理" endpoint="/api/admin/system/mail-log" />
}
