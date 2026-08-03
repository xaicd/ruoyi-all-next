"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function CrmCluesModulePage() {
  return <AdminListPageTemplate title="线索管理" endpoint="/api/admin/crm/clues" />
}
