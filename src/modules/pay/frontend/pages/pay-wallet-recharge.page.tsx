"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function PayWalletRechargePage() {
  return <AdminListPageTemplate title="PayWalletRecharge管理" endpoint="/api/admin/pay/pay-wallet-recharge" />
}
