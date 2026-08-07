"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BrokerageRecordPage() {
  return <AdminListPageTemplate title="BrokerageRecord管理" endpoint="/api/admin/mall/brokerage-record" />
}
