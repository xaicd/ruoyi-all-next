"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MpFreePublishPage() {
  return <AdminListPageTemplate title="MpFreePublish管理" endpoint="/api/admin/mp/mp-free-publish" />
}
