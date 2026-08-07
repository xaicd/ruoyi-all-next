"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmContactPage() {
  return <AdminListPageTemplate title="CrmContact管理" endpoint="/api/admin/crm/crm-contact" />
}
