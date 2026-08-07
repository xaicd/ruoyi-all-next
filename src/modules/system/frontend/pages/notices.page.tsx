"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SystemNoticesModulePage() {
  return <AdminListPageTemplate title="系统通知" endpoint="/api/admin/system/notices" />
}
