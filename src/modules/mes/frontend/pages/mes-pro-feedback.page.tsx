"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function MesProFeedbackPage() {
  return <AdminListPageTemplate title="MesProFeedback管理" endpoint="/api/admin/mes/mes-pro-feedback" />
}
