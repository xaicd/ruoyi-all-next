"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SocialClientPage() {
  return <AdminListPageTemplate title="SocialClient管理" endpoint="/api/admin/system/social-client" />
}
