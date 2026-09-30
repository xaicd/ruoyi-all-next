"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MemberUserPage() {
  return <AdminListPageTemplate title="MemberUser管理" endpoint="/api/admin/member/member-user" />
}
