"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function SystemTenantsModulePage() {
  return <AdminListPageTemplate title="租户管理" endpoint="/api/admin/system/tenants" />
}
