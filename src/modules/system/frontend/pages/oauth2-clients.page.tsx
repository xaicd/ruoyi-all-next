"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SystemOauth2ClientsModulePage() {
  return <AdminListPageTemplate title="OAuth2客户端" endpoint="/api/admin/system/oauth2/clients" />
}
