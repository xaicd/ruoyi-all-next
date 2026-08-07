"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesCalTeamMemberPage() {
  return <AdminListPageTemplate title="MesCalTeamMember管理" endpoint="/api/admin/mes/mes-cal-team-member" />
}
