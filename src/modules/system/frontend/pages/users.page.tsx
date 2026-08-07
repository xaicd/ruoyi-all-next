"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SystemUsersModulePage() {
  return <AdminListPageTemplate title="用户管理" endpoint="/api/admin/system/users" />
}
