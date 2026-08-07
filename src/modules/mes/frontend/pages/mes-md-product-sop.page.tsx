"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesMdProductSopPage() {
  return <AdminListPageTemplate title="MesMdProductSop管理" endpoint="/api/admin/mes/mes-md-product-sop" />
}
