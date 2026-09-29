"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function TradeConfigPage() {
  return <AdminListPageTemplate title="TradeConfig管理" endpoint="/api/admin/mall/trade-config" />
}
