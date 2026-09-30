"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmProductProduceLinePage() {
  return <AdminListPageTemplate title="MesWmProductProduceLine管理" endpoint="/api/admin/mes/mes-wm-product-produce-line" />
}
