"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function IotThingModelPage() {
  return <AdminListPageTemplate title="IotThingModel管理" endpoint="/api/admin/iot/iot-thing-model" />
}
