"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SystemNotifyMessagesModulePage() {
  return <AdminListPageTemplate title="通知消息" endpoint="/api/admin/system/notify/messages" />
}
