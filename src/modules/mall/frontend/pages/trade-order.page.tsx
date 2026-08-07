"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function TradeOrderPage() {
  return <AdminListPageTemplate title="TradeOrder管理" endpoint="/api/admin/mall/trade-order" />
}
