"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function DeliveryExpressTemplatePage() {
  return <AdminListPageTemplate title="DeliveryExpressTemplate管理" endpoint="/api/admin/mall/delivery-express-template" />
}
