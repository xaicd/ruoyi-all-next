"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function SystemOauth2ClientsModulePage() {
  return <AdminListPageTemplate title="OAuth2 客户端" endpoint="/api/admin/system/oauth2/clients" />
}
