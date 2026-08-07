"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SystemDictsModulePage() {
  return <AdminListPageTemplate title="数据字典" endpoint="/api/admin/system/dicts" />
}
