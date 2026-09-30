"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesWmPackageLinePage() {
  return <AdminListPageTemplate title="MesWmPackageLine管理" endpoint="/api/admin/mes/mes-wm-package-line" />
}
