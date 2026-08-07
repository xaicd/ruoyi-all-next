"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MemberSignInConfigPage() {
  return <AdminListPageTemplate title="MemberSignInConfig管理" endpoint="/api/admin/member/member-sign-in-config" />
}
