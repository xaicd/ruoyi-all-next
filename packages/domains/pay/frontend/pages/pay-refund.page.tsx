"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function PayRefundPage() {
  return <AdminListPageTemplate title="PayRefund管理" endpoint="/api/admin/pay/pay-refund" />
}
