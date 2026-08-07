"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function DataSourceConfigPage() {
  return <AdminListPageTemplate title="DataSourceConfig管理" endpoint="/api/admin/infra/data-source-config" />
}
