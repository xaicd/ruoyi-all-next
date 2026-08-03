"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function InfraDbConfigsModulePage() {
  return <AdminListPageTemplate title="数据源配置" endpoint="/api/admin/infra/db-configs" />
}
