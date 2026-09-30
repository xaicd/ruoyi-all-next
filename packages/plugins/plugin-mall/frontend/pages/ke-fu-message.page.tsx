"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function KeFuMessagePage() {
  return <AdminListPageTemplate title="KeFuMessage管理" endpoint="/api/admin/mall/ke-fu-message" />
}
