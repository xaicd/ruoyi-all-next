"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CouponTemplatePage() {
  return <AdminListPageTemplate title="CouponTemplate管理" endpoint="/api/admin/mall/coupon-template" />
}
