"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesProAndonConfigPage() {
  return <AdminListPageTemplate title="MesProAndonConfig管理" endpoint="/api/admin/mes/mes-pro-andon-config" />
}
