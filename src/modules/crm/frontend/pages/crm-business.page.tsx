"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmBusinessPage() {
  return <AdminListPageTemplate title="CrmBusiness管理" endpoint="/api/admin/crm/crm-business" />
}
