"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesMdProductBomPage() {
  return <AdminListPageTemplate title="MesMdProductBom管理" endpoint="/api/admin/mes/mes-md-product-bom" />
}
