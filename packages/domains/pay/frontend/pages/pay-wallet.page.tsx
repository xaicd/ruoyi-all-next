"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function PayWalletPage() {
  return <AdminListPageTemplate title="PayWallet管理" endpoint="/api/admin/pay/pay-wallet" />
}
