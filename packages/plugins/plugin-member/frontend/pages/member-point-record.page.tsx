"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MemberPointRecordPage() {
  return <AdminListPageTemplate title="MemberPointRecord管理" endpoint="/api/admin/member/member-point-record" />
}
