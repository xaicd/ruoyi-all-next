"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MemberUsersModulePage() {
  return <AdminListPageTemplate title="会员列表" endpoint="/api/admin/member/users" />
}
