"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function IotSceneRulePage() {
  return <AdminListPageTemplate title="IotSceneRule管理" endpoint="/api/admin/iot/iot-scene-rule" />
}
