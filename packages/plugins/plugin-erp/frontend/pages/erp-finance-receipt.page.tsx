"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ErpFinanceReceiptPage() {
  return <AdminListPageTemplate title="ErpFinanceReceipt管理" endpoint="/api/admin/erp/erp-finance-receipt" />
}
