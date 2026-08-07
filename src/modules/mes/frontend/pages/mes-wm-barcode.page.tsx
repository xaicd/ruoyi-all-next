"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmBarcodePage() {
  return <AdminListPageTemplate title="MesWmBarcode管理" endpoint="/api/admin/mes/mes-wm-barcode" />
}
