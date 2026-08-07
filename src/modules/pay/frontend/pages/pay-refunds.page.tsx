"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function PayRefundsModulePage() {
  return <AdminListPageTemplate title="退款单" endpoint="/api/admin/pay/refunds" />
}
