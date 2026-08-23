"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AigwChannelsPage() {
  return <AdminListPageTemplate title="上游渠道" endpoint="/api/v1/admin/aigw/channels" />
}
