"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function SeckillConfigPage() {
  return <AdminListPageTemplate title="SeckillConfig管理" endpoint="/api/admin/mall/seckill-config" />
}
