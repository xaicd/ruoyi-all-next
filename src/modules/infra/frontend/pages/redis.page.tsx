"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function InfraRedisModulePage() {
  return <AdminListPageTemplate title="Redis监控" endpoint="/api/admin/infra/redis" />
}
