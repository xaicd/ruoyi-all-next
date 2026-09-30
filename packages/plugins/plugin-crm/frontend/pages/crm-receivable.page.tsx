"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmReceivablePage() {
  return <AdminListPageTemplate title="CrmReceivable管理" endpoint="/api/admin/crm/crm-receivable" />
}
