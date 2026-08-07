"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function UserProfilePage() {
  return <AdminListPageTemplate title="UserProfile管理" endpoint="/api/admin/system/user-profile" />
}
