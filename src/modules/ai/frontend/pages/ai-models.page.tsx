"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AiModelsModulePage() {
  return <AdminListPageTemplate title="AI模型管理" endpoint="/api/admin/ai/models" />
}
