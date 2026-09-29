"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SystemIpAreasModulePage() {
  return <AdminListPageTemplate title="IP区域" endpoint="/api/admin/system/ip/areas" />
}
