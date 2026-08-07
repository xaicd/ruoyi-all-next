"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AreaPage() {
  return <AdminListPageTemplate title="Area管理" endpoint="/api/admin/system/area" />
}
