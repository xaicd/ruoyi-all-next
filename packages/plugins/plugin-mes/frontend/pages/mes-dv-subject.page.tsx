"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesDvSubjectPage() {
  return <AdminListPageTemplate title="MesDvSubject管理" endpoint="/api/admin/mes/mes-dv-subject" />
}
