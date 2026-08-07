"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function Demo01contactPage() {
  return <AdminListPageTemplate title="Demo01contact管理" endpoint="/api/admin/infra/demo01contact" />
}
