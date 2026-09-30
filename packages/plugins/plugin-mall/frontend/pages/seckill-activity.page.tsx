"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SeckillActivityPage() {
  return <AdminListPageTemplate title="SeckillActivity管理" endpoint="/api/admin/mall/seckill-activity" />
}
