"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmPerformanceConfigPage() {
  return <AdminListPageTemplate title="CrmPerformanceConfig管理" endpoint="/api/admin/crm/crm-performance-config" />
}
