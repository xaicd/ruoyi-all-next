"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ImFriendManagerPage() {
  return <AdminListPageTemplate title="ImFriendManager管理" endpoint="/api/admin/im/im-friend-manager" />
}
