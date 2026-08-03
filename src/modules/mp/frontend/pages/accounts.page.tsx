"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function MpAccountsModulePage() {
  return <AdminListPageTemplate title="公众号账号" endpoint="/api/admin/mp/accounts" />
}
