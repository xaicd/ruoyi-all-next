"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmWarehousePage() {
  return <AdminListPageTemplate title="MesWmWarehouse管理" endpoint="/api/admin/mes/mes-wm-warehouse" />
}
