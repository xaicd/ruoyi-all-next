"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesMdItemTypePage() {
  return <AdminListPageTemplate title="MesMdItemType管理" endpoint="/api/admin/mes/mes-md-item-type" />
}
