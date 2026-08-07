"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmStatisticsFunnelPage() {
  return <AdminListPageTemplate title="CrmStatisticsFunnel管理" endpoint="/api/admin/crm/crm-statistics-funnel" />
}
