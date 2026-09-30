"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesProRoutePage() {
  return <AdminListPageTemplate title="MesProRoute管理" endpoint="/api/admin/mes/mes-pro-route" />
}
