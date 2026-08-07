"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImRtcCallManagerPage() {
  return <AdminListPageTemplate title="ImRtcCallManager管理" endpoint="/api/admin/im/im-rtc-call-manager" />
}
