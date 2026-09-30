"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ProductFavoritePage() {
  return <AdminListPageTemplate title="ProductFavorite管理" endpoint="/api/admin/mall/product-favorite" />
}
