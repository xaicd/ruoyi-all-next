"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function SystemNotifyTemplatesModulePage() {
  return <AdminListPageTemplate title="通知模板" endpoint="/api/admin/system/notify/templates" />
}
