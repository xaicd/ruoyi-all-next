"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpFinancePaymentPage() {
  return <AdminListPageTemplate title="ErpFinancePayment管理" endpoint="/api/admin/erp/erp-finance-payment" />
}
