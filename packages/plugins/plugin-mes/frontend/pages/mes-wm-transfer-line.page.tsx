"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmTransferLinePage() {
  return <AdminListPageTemplate title="MesWmTransferLine管理" endpoint="/api/admin/mes/mes-wm-transfer-line" />
}
