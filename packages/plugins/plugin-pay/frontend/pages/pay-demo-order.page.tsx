"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function PayDemoOrderPage() {
  return <AdminListPageTemplate title="PayDemoOrder管理" endpoint="/api/admin/pay/pay-demo-order" />
}
