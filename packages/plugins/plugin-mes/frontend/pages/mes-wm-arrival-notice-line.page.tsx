"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmArrivalNoticeLinePage() {
  return <AdminListPageTemplate title="MesWmArrivalNoticeLine管理" endpoint="/api/admin/mes/mes-wm-arrival-notice-line" />
}
