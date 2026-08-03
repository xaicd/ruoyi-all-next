"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function InfraFilesModulePage() {
  return <AdminListPageTemplate title="文件管理" endpoint="/api/admin/infra/files" />
}
