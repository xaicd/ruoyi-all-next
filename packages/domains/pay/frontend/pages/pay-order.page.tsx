"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function PayOrderPage() {
  return <AdminListPageTemplate title="PayOrder管理" endpoint="/api/admin/pay/pay-order" />
}
