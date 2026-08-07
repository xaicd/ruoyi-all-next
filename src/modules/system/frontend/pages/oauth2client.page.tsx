"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function Oauth2clientPage() {
  return <AdminListPageTemplate title="Oauth2client管理" endpoint="/api/admin/system/oauth2client" />
}
