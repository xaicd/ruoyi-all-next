"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmBarcodeConfigPage() {
  return <AdminListPageTemplate title="MesWmBarcodeConfig管理" endpoint="/api/admin/mes/mes-wm-barcode-config" />
}
