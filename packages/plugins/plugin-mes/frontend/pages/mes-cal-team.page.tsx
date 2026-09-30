"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesCalTeamPage() {
  return <AdminListPageTemplate title="MesCalTeam管理" endpoint="/api/admin/mes/mes-cal-team" />
}
