"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SocialUserPage() {
  return <AdminListPageTemplate title="SocialUser管理" endpoint="/api/admin/system/social-user" />
}
