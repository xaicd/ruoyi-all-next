"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function InfraFilesModulePage() {
  return <AdminListPageTemplate title="文件管理" endpoint="/api/admin/infra/files" />
}
