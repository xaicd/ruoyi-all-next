"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function InfraConfigsModulePage() {
  return <AdminListPageTemplate title="参数中心" endpoint="/api/admin/infra/configs" />
}
