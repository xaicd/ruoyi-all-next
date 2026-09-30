"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImFriendPage() {
  return <AdminListPageTemplate title="ImFriend管理" endpoint="/api/admin/im/im-friend" />
}
