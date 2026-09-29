"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function PayOrdersModulePage() {
  return <AdminListPageTemplate title="支付订单" endpoint="/api/admin/pay/orders" />
}
