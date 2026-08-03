"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function InfraFileConfigsModulePage() {
  return <AdminListPageTemplate title="存储配置" endpoint="/api/admin/infra/file-configs" />
}
