"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function IotProductPage() {
  return <AdminListPageTemplate title="IotProduct管理" endpoint="/api/admin/iot/iot-product" />
}
