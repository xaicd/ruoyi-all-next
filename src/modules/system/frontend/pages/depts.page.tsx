"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function SystemDeptsModulePage() {
  return <AdminListPageTemplate title="部门管理" endpoint="/api/admin/system/depts" />
}
