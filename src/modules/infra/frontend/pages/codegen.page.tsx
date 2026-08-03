"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function InfraCodegenModulePage() {
  return <AdminListPageTemplate title="代码生成" endpoint="/api/admin/infra/codegen" />
}
