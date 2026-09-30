"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MemberLevelPage() {
  return <AdminListPageTemplate title="MemberLevel管理" endpoint="/api/admin/member/member-level" />
}
