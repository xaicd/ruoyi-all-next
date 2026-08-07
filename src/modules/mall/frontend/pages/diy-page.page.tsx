"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function DiyPagePage() {
  return <AdminListPageTemplate title="DiyPage管理" endpoint="/api/admin/mall/diy-page" />
}
