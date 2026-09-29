"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImFriendRequestPage() {
  return <AdminListPageTemplate title="ImFriendRequest管理" endpoint="/api/admin/im/im-friend-request" />
}
