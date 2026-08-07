"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MemberLevelRecordPage() {
  return <AdminListPageTemplate title="MemberLevelRecord管理" endpoint="/api/admin/member/member-level-record" />
}
