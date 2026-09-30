"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmReturnVendorPage() {
  return <AdminListPageTemplate title="MesWmReturnVendor管理" endpoint="/api/admin/mes/mes-wm-return-vendor" />
}
