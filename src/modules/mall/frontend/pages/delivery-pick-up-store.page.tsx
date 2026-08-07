"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function DeliveryPickUpStorePage() {
  return <AdminListPageTemplate title="DeliveryPickUpStore管理" endpoint="/api/admin/mall/delivery-pick-up-store" />
}
