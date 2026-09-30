"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesDvCheckPlanSubjectPage() {
  return <AdminListPageTemplate title="MesDvCheckPlanSubject管理" endpoint="/api/admin/mes/mes-dv-check-plan-subject" />
}
