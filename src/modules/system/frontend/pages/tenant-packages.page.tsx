"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SystemTenantPackagesModulePage() {
  return <AdminListPageTemplate title="租户套餐" endpoint="/api/admin/system/tenant-packages" />
}
