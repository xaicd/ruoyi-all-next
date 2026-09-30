"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesMdProductSipPage() {
  return <AdminListPageTemplate title="MesMdProductSip管理" endpoint="/api/admin/mes/mes-md-product-sip" />
}
