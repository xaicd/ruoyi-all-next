"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function IotDataSinkPage() {
  return <AdminListPageTemplate title="IotDataSink管理" endpoint="/api/admin/iot/iot-data-sink" />
}
