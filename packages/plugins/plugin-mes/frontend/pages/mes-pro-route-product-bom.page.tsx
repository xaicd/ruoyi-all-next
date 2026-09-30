"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesProRouteProductBomPage() {
  return <AdminListPageTemplate title="MesProRouteProductBom管理" endpoint="/api/admin/mes/mes-pro-route-product-bom" />
}
