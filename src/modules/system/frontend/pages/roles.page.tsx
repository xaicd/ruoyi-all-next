"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function SystemRolesModulePage() {
  return <AdminListPageTemplate title="角色管理" endpoint="/api/admin/system/roles" />
}
