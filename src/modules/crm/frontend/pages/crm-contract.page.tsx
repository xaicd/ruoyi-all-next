"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmContractPage() {
  return <AdminListPageTemplate title="CrmContract管理" endpoint="/api/admin/crm/crm-contract" />
}
