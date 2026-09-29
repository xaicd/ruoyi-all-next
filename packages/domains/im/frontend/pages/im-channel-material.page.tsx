"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImChannelMaterialPage() {
  return <AdminListPageTemplate title="ImChannelMaterial管理" endpoint="/api/admin/im/im-channel-material" />
}
