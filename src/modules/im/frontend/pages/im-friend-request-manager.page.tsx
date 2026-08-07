"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImFriendRequestManagerPage() {
  return <AdminListPageTemplate title="ImFriendRequestManager管理" endpoint="/api/admin/im/im-friend-request-manager" />
}
