"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesDvCheckRecordLinePage() {
  return <AdminListPageTemplate title="MesDvCheckRecordLine管理" endpoint="/api/admin/mes/mes-dv-check-record-line" />
}
