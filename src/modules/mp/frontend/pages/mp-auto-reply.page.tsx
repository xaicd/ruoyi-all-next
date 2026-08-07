"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MpAutoReplyPage() {
  return <AdminListPageTemplate title="MpAutoReply管理" endpoint="/api/admin/mp/mp-auto-reply" />
}
