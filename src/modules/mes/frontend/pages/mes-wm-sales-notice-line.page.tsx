"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmSalesNoticeLinePage() {
  return <AdminListPageTemplate title="MesWmSalesNoticeLine管理" endpoint="/api/admin/mes/mes-wm-sales-notice-line" />
}
