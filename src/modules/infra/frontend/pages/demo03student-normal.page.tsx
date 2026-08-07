"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function Demo03studentNormalPage() {
  return <AdminListPageTemplate title="Demo03studentNormal管理" endpoint="/api/admin/infra/demo03student-normal" />
}
