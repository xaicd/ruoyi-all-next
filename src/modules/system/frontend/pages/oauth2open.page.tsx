"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function Oauth2openPage() {
  return <AdminListPageTemplate title="Oauth2open管理" endpoint="/api/admin/system/oauth2open" />
}
