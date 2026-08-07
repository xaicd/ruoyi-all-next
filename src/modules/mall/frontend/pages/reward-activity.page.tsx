"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function RewardActivityPage() {
  return <AdminListPageTemplate title="RewardActivity管理" endpoint="/api/admin/mall/reward-activity" />
}
