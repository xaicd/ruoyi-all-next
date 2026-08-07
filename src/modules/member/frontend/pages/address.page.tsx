"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function AddressPage() {
  return <AdminListPageTemplate title="Address管理" endpoint="/api/admin/member/address" />
}
