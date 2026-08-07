"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmPermissionPage() {
  return <AdminListPageTemplate title="CrmPermission管理" endpoint="/api/admin/crm/crm-permission" />
}
