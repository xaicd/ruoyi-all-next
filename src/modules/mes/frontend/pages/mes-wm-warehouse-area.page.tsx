"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmWarehouseAreaPage() {
  return <AdminListPageTemplate title="MesWmWarehouseArea管理" endpoint="/api/admin/mes/mes-wm-warehouse-area" />
}
