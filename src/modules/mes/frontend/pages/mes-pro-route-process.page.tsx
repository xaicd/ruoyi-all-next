"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesProRouteProcessPage() {
  return <AdminListPageTemplate title="MesProRouteProcess管理" endpoint="/api/admin/mes/mes-pro-route-process" />
}
