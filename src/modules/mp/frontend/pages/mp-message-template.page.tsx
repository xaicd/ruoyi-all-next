"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MpMessageTemplatePage() {
  return <AdminListPageTemplate title="MpMessageTemplate管理" endpoint="/api/admin/mp/mp-message-template" />
}
