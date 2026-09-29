"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function PayNotifyPage() {
  return <AdminListPageTemplate title="PayNotify管理" endpoint="/api/admin/pay/pay-notify" />
}
