"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SystemOauth2TokensModulePage() {
  return <AdminListPageTemplate title="OAuth2 令牌" endpoint="/api/v1/admin/system/oauth2/tokens" />
}
