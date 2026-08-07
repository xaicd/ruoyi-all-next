"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesMdItemBatchConfigPage() {
  return <AdminListPageTemplate title="MesMdItemBatchConfig管理" endpoint="/api/admin/mes/mes-md-item-batch-config" />
}
