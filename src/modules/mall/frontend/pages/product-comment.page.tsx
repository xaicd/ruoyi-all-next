"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ProductCommentPage() {
  return <AdminListPageTemplate title="ProductComment管理" endpoint="/api/admin/mall/product-comment" />
}
