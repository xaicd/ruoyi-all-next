"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesProAndonRecordPage() {
  return <AdminListPageTemplate title="MesProAndonRecord管理" endpoint="/api/admin/mes/mes-pro-andon-record" />
}
