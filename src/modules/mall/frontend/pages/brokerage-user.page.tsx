"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function BrokerageUserPage() {
  return <AdminListPageTemplate title="BrokerageUser管理" endpoint="/api/admin/mall/brokerage-user" />
}
