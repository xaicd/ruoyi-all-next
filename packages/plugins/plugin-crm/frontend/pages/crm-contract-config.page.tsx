"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmContractConfigPage() {
  return <AdminListPageTemplate title="CrmContractConfig管理" endpoint="/api/admin/crm/crm-contract-config" />
}
