"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesCalHolidayPage() {
  return <AdminListPageTemplate title="MesCalHoliday管理" endpoint="/api/admin/mes/mes-cal-holiday" />
}
