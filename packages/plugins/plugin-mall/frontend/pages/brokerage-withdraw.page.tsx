"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BrokerageWithdrawPage() {
  return <AdminListPageTemplate title="BrokerageWithdraw管理" endpoint="/api/admin/mall/brokerage-withdraw" />
}
