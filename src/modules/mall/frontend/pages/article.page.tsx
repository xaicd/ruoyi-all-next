"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ArticlePage() {
  return <AdminListPageTemplate title="Article管理" endpoint="/api/admin/mall/article" />
}
