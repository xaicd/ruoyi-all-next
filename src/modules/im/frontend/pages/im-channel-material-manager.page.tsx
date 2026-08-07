"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImChannelMaterialManagerPage() {
  return <AdminListPageTemplate title="ImChannelMaterialManager管理" endpoint="/api/admin/im/im-channel-material-manager" />
}
