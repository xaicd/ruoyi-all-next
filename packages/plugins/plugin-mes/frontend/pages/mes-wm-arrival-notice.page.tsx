"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmArrivalNoticePage() {
  return <AdminListPageTemplate title="MesWmArrivalNotice管理" endpoint="/api/admin/mes/mes-wm-arrival-notice" />
}
