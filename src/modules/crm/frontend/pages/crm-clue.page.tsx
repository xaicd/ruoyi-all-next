"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmCluePage() {
  return <AdminListPageTemplate title="CrmClue管理" endpoint="/api/admin/crm/crm-clue" />
}
