"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function PayTransferPage() {
  return <AdminListPageTemplate title="PayTransfer管理" endpoint="/api/admin/pay/pay-transfer" />
}
