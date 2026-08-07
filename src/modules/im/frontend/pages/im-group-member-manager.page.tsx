"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImGroupMemberManagerPage() {
  return <AdminListPageTemplate title="ImGroupMemberManager管理" endpoint="/api/admin/im/im-group-member-manager" />
}
