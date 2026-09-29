"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MemberConfigPage() {
  return <AdminListPageTemplate title="MemberConfig管理" endpoint="/api/admin/member/member-config" />
}
