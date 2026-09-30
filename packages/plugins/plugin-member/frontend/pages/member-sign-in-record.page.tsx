"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MemberSignInRecordPage() {
  return <AdminListPageTemplate title="MemberSignInRecord管理" endpoint="/api/admin/member/member-sign-in-record" />
}
