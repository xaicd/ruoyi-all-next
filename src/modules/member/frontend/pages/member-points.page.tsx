"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MemberPointsModulePage() {
  return <AdminListPageTemplate title="积分记录" endpoint="/api/admin/member/points" />
}
