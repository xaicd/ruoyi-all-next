"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MailAccountPage() {
  return <AdminListPageTemplate title="MailAccount管理" endpoint="/api/admin/system/mail-account" />
}
