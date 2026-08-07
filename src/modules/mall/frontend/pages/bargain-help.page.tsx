"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BargainHelpPage() {
  return <AdminListPageTemplate title="BargainHelp管理" endpoint="/api/admin/mall/bargain-help" />
}
