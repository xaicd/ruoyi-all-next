"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BannerPage() {
  return <AdminListPageTemplate title="Banner管理" endpoint="/api/admin/mall/banner" />
}
