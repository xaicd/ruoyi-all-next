"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImRtcLiveKitPage() {
  return <AdminListPageTemplate title="ImRtcLiveKit管理" endpoint="/api/admin/im/im-rtc-live-kit" />
}
