"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesMdUnitMeasurePage() {
  return <AdminListPageTemplate title="MesMdUnitMeasure管理" endpoint="/api/admin/mes/mes-md-unit-measure" />
}
