"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function PayWalletRechargePackagePage() {
  return <AdminListPageTemplate title="PayWalletRechargePackage管理" endpoint="/api/admin/pay/pay-wallet-recharge-package" />
}
