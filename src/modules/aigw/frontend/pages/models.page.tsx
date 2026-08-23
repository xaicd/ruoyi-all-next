"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AigwModelsPage() {
  return <AdminListPageTemplate title="模型目录" endpoint="/api/v1/admin/aigw/models" />
}
