"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function Oauth2tokenPage() {
  return <AdminListPageTemplate title="Oauth2token管理" endpoint="/api/admin/system/oauth2token" />
}
