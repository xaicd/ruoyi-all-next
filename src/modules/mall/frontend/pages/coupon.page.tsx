"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CouponPage() {
  return <AdminListPageTemplate title="Coupon管理" endpoint="/api/admin/mall/coupon" />
}
