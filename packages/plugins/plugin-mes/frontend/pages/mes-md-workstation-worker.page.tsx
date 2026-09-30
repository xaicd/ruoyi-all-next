"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesMdWorkstationWorkerPage() {
  return <AdminListPageTemplate title="MesMdWorkstationWorker管理" endpoint="/api/admin/mes/mes-md-workstation-worker" />
}
