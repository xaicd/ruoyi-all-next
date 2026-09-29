"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesCalTeamShiftPage() {
  return <AdminListPageTemplate title="MesCalTeamShift管理" endpoint="/api/admin/mes/mes-cal-team-shift" />
}
