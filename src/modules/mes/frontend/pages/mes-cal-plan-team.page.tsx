"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesCalPlanTeamPage() {
  return <AdminListPageTemplate title="MesCalPlanTeam管理" endpoint="/api/admin/mes/mes-cal-plan-team" />
}
