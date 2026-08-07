"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmReceivablePlanPage() {
  return <AdminListPageTemplate title="CrmReceivablePlan管理" endpoint="/api/admin/crm/crm-receivable-plan" />
}
