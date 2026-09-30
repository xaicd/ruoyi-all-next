"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BpmCommentPage() {
  return <AdminListPageTemplate title="BpmComment管理" endpoint="/api/admin/bpm/bpm-comment" />
}
