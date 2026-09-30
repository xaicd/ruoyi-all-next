"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmSalesNoticePage() {
  return <AdminListPageTemplate title="MesWmSalesNotice管理" endpoint="/api/admin/mes/mes-wm-sales-notice" />
}
