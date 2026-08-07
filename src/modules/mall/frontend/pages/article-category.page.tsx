"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ArticleCategoryPage() {
  return <AdminListPageTemplate title="ArticleCategory管理" endpoint="/api/admin/mall/article-category" />
}
