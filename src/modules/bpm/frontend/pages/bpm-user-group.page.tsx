"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BpmUserGroupPage() {
  return <AdminListPageTemplate title="BpmUserGroup管理" endpoint="/api/admin/bpm/bpm-user-group" />
}
