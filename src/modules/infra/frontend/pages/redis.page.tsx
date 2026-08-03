"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function InfraRedisModulePage() {
  return <AdminListPageTemplate title="Redis监控" endpoint="/api/admin/infra/redis" />
}
