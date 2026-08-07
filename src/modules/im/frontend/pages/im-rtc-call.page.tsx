"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImRtcCallPage() {
  return <AdminListPageTemplate title="ImRtcCall管理" endpoint="/api/admin/im/im-rtc-call" />
}
