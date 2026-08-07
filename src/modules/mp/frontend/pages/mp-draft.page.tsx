"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MpDraftPage() {
  return <AdminListPageTemplate title="MpDraft管理" endpoint="/api/admin/mp/mp-draft" />
}
