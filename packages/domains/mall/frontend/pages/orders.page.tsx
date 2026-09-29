"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MallOrdersModulePage() {
  return <AdminListPageTemplate title="商城订单" endpoint="/api/admin/mall/orders" />
}
