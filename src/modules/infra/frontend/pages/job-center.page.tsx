"use client"

import { AdminListPageTemplate } from "@/frontend/templates/admin-list-page.template"

export default function InfraJobCenterModulePage() {
  return <AdminListPageTemplate title="任务中心" endpoint="/api/admin/infra/job-center" />
}
