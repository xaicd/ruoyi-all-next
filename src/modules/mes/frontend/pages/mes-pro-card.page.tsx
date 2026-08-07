"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesProCardPage() {
  return <AdminListPageTemplate title="MesProCard管理" endpoint="/api/admin/mes/mes-pro-card" />
}
