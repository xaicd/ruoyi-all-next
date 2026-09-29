"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function PayDemoWithdrawPage() {
  return <AdminListPageTemplate title="PayDemoWithdraw管理" endpoint="/api/admin/pay/pay-demo-withdraw" />
}
