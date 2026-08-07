"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AfterSalePage() {
  return <AdminListPageTemplate title="AfterSale管理" endpoint="/api/admin/mall/after-sale" />
}
