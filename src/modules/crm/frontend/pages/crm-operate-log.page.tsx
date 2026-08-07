"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function CrmOperateLogPage() {
  return <AdminListPageTemplate title="CrmOperateLog管理" endpoint="/api/admin/crm/crm-operate-log" />
}
