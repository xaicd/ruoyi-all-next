"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmReturnVendorLinePage() {
  return <AdminListPageTemplate title="MesWmReturnVendorLine管理" endpoint="/api/admin/mes/mes-wm-return-vendor-line" />
}
