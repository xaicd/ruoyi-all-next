"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function SystemOnlineUsersModulePage() {
  return <AdminListPageTemplate title="在线用户" endpoint="/api/admin/system/online-users" />
}
