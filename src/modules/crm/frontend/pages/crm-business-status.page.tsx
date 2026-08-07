"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmBusinessStatusPage() {
  return <AdminListPageTemplate title="CrmBusinessStatus管理" endpoint="/api/admin/crm/crm-business-status" />
}
