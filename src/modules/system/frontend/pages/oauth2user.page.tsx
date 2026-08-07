"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function Oauth2userPage() {
  return <AdminListPageTemplate title="Oauth2user管理" endpoint="/api/admin/system/oauth2user" />
}
