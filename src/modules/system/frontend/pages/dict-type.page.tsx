"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function DictTypePage() {
  return <AdminListPageTemplate title="DictType管理" endpoint="/api/admin/system/dict-type" />
}
