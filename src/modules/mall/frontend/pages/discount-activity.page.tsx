"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function DiscountActivityPage() {
  return <AdminListPageTemplate title="DiscountActivity管理" endpoint="/api/admin/mall/discount-activity" />
}
