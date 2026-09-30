"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesProWorkRecordPage() {
  return <AdminListPageTemplate title="MesProWorkRecord管理" endpoint="/api/admin/mes/mes-pro-work-record" />
}
