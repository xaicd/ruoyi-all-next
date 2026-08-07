"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmProductPage() {
  return <AdminListPageTemplate title="CrmProduct管理" endpoint="/api/admin/crm/crm-product" />
}
