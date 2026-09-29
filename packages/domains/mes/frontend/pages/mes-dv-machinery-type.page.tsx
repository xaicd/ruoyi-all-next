"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesDvMachineryTypePage() {
  return <AdminListPageTemplate title="MesDvMachineryType管理" endpoint="/api/admin/mes/mes-dv-machinery-type" />
}
