"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MemberTagPage() {
  return <AdminListPageTemplate title="MemberTag管理" endpoint="/api/admin/member/member-tag" />
}
