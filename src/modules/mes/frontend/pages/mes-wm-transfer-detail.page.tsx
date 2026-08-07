"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmTransferDetailPage() {
  return <AdminListPageTemplate title="MesWmTransferDetail管理" endpoint="/api/admin/mes/mes-wm-transfer-detail" />
}
