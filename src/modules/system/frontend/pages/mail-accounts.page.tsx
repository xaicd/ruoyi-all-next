"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SystemMailAccountsModulePage() {
  return <AdminListPageTemplate title="邮件账号" endpoint="/api/admin/system/mail/accounts" />
}
