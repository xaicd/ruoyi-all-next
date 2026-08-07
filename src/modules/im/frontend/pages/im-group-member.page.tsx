"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImGroupMemberPage() {
  return <AdminListPageTemplate title="ImGroupMember管理" endpoint="/api/admin/im/im-group-member" />
}
