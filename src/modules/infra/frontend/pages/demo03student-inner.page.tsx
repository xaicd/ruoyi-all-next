"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function Demo03studentInnerPage() {
  return <AdminListPageTemplate title="Demo03studentInner管理" endpoint="/api/admin/infra/demo03student-inner" />
}
