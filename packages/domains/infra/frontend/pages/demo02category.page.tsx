"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function Demo02categoryPage() {
  return <AdminListPageTemplate title="Demo02category管理" endpoint="/api/admin/infra/demo02category" />
}
