"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmWarehouseLocationPage() {
  return <AdminListPageTemplate title="MesWmWarehouseLocation管理" endpoint="/api/admin/mes/mes-wm-warehouse-location" />
}
