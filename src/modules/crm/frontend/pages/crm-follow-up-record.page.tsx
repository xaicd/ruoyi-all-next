"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmFollowUpRecordPage() {
  return <AdminListPageTemplate title="CrmFollowUpRecord管理" endpoint="/api/admin/crm/crm-follow-up-record" />
}
