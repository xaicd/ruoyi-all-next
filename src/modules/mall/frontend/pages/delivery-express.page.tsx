"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function DeliveryExpressPage() {
  return <AdminListPageTemplate title="DeliveryExpress管理" endpoint="/api/admin/mall/delivery-express" />
}
