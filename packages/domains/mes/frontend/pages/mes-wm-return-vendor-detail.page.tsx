"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmReturnVendorDetailPage() {
  return <AdminListPageTemplate title="MesWmReturnVendorDetail管理" endpoint="/api/admin/mes/mes-wm-return-vendor-detail" />
}
