"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SystemSocialUsersModulePage() {
  return <AdminListPageTemplate title="社交用户" endpoint="/api/admin/system/social/users" />
}
