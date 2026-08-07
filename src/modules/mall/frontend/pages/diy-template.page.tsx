"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function DiyTemplatePage() {
  return <AdminListPageTemplate title="DiyTemplate管理" endpoint="/api/admin/mall/diy-template" />
}
