"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function SystemMenusModulePage() {
  return <AdminListPageTemplate title="菜单管理" endpoint="/api/admin/system/menus" />
}
