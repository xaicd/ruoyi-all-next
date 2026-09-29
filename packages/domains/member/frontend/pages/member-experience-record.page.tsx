"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MemberExperienceRecordPage() {
  return <AdminListPageTemplate title="MemberExperienceRecord管理" endpoint="/api/admin/member/member-experience-record" />
}
