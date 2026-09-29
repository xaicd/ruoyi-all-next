"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MemberGroupPage() {
  return <AdminListPageTemplate title="MemberGroup管理" endpoint="/api/admin/member/member-group" />
}
