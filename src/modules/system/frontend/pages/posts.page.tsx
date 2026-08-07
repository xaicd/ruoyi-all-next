"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SystemPostsModulePage() {
  return <AdminListPageTemplate title="岗位管理" endpoint="/api/admin/system/posts" />
}
