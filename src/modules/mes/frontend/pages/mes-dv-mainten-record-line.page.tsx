"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesDvMaintenRecordLinePage() {
  return <AdminListPageTemplate title="MesDvMaintenRecordLine管理" endpoint="/api/admin/mes/mes-dv-mainten-record-line" />
}
