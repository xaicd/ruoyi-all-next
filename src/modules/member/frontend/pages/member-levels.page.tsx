"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MemberLevelsModulePage() {
  return <AdminListPageTemplate title="会员等级" endpoint="/api/admin/member/levels" />
}
