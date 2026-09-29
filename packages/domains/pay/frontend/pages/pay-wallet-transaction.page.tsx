"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function PayWalletTransactionPage() {
  return <AdminListPageTemplate title="PayWalletTransaction管理" endpoint="/api/admin/pay/pay-wallet-transaction" />
}
